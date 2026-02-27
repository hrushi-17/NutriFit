using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/progress")]
public class ProgressController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProgressController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("add")]
    public IActionResult AddProgress(double weight)
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
            if (profile == null)
                return BadRequest("Profile not found");

            decimal heightMeter = profile.Height / 100m;
            double bmi = (double)(weight / (double)(heightMeter * heightMeter));
            bmi = Math.Round(bmi, 2);

            string category = bmi < 18.5 ? "low" : bmi < 25.0 ? "normal" : "high";
            
            // ? Fix: Handle "Today" based on IST (UTC+5:30) to prevent duplicates across midnight
            // Get current UTC time
            DateTime nowUtc = DateTime.UtcNow;
            // Convert to IST
            DateTime nowIst = nowUtc.AddHours(5.5);
            // Get IST Date (Midnight)
            DateTime todayIst = nowIst.Date;
            
            // Calculate start and end of "Today" in UTC
            // e.g. Feb 3rd 00:00 IST -> Feb 2nd 18:30 UTC
            DateTime rangeStartUtc = todayIst.AddHours(-5.5);
            DateTime rangeEndUtc = rangeStartUtc.AddDays(1);

            // Update existing log if it exists within this IST day range
            var existingLog = _db.ProgressLogs
                .FirstOrDefault(x => x.UserId == userId && x.Date >= rangeStartUtc && x.Date < rangeEndUtc);

            if (existingLog != null)
            {
                existingLog.Weight = weight;
                existingLog.Bmi = bmi;
                existingLog.WeightCategory = category;
                existingLog.Date = DateTime.UtcNow; // Update timestamp to now (UTC)
            }
            else
            {
                var log = new ProgressLog
                {
                    UserId = userId,
                    Weight = weight,
                    Bmi = bmi,
                    WeightCategory = category,
                    Date = DateTime.UtcNow // Store as UTC
                };
                _db.ProgressLogs.Add(log);
            }

            profile.Weight = (decimal)weight;
            profile.Bmi = (decimal)bmi;
            profile.WeightCategory = category;

            _db.SaveChanges();

            CheckGoalAuto(userId);
            OverrideWorkoutAndDiet(userId, category);

            return Ok(new { message = "Progress saved", bmi, category });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("my")]
    public IActionResult MyProgress()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            var data = _db.ProgressLogs
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.Date)
                .Select(x => new
                {
                    x.Date,
                    x.Weight,
                    x.Bmi,
                    x.WeightCategory
                })
                .ToList();

            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("latest")]
    public IActionResult Latest()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            var data = _db.ProgressLogs
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Date)
                .FirstOrDefault();

            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    private void CheckGoalAuto(int userId)
    {
        var goal = _db.Goals.FirstOrDefault(x => x.UserId == userId && x.Status == "in_progress");
        if (goal == null) return;

        var latest = _db.ProgressLogs
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date)
            .FirstOrDefault();

        if (latest == null) return;

        bool completed = false;
        if (goal.GoalType == "weight_loss" && latest.Weight <= goal.TargetValue) completed = true;
        if (goal.GoalType == "muscle_gain" && latest.Weight >= goal.TargetValue) completed = true;
        if (goal.GoalType == "fitness" && latest.Bmi >= 18.5 && latest.Bmi < 25.0) completed = true;

        if (completed)
        {
            goal.Status = "completed";
            goal.EndDate = DateTime.Now;
            _db.SaveChanges();
        }
    }

    private void OverrideWorkoutAndDiet(int userId, string category)
    {
        var goal = _db.Goals.FirstOrDefault(x => x.UserId == userId && x.Status == "in_progress");
        if (goal == null) return;

        var profile = _db.UserProfiles.First(x => x.UserId == userId);

        string dbGoal = goal.GoalType.ToLower() == "weight_loss" ? "Weight Loss"
                      : goal.GoalType.ToLower() == "muscle_gain" ? "Muscle Gain"
                      : "Fitness";

        string dbCategory = category == "low" ? "Underweight" :
                            category == "normal" ? "Normal" : "Overweight";

        string dbActivity = (profile.ActivityLevel ?? "Medium").ToLower() == "low" ? "Low"
                          : (profile.ActivityLevel ?? "Medium").ToLower() == "high" ? "High"
                          : "Medium";

        var workout = _db.WorkoutPlans.FirstOrDefault(x =>
            x.Goal == dbGoal &&
            x.ActivityLevel == dbActivity &&
            x.WeightCategory == dbCategory);

        var diet = _db.DietPlans.FirstOrDefault(x =>
            x.Goal == dbGoal &&
            x.FoodPreference == profile.FoodPreference &&
            x.WeightCategory == dbCategory);
    }
}
