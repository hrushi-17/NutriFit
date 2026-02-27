using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/goals")]
public class GoalsController : ControllerBase
{
    private readonly AppDbContext _db;

    public GoalsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("set")]
    public IActionResult SetGoal([FromBody] Goal goalInput)
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            // Create a clean new instance to avoid tracking issues
            var goal = new Goal
            {
                UserId = userId,
                GoalType = goalInput.GoalType ?? "weight_loss",
                TargetValue = goalInput.TargetValue,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now, // Placeholder for non-nullable DB column
                Status = "in_progress"
            };

            var oldGoals = _db.Goals.Where(x => x.UserId == userId && x.Status == "in_progress").ToList();
            foreach (var old in oldGoals)
            {
                old.Status = "closed";
                old.EndDate = DateTime.Now;
            }

            var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
            if (profile != null)
                profile.Goal = goal.GoalType;

            _db.Goals.Add(goal);
            _db.SaveChanges();

            CheckGoalAuto(userId);

            return Ok(goal);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = ex.Message, 
                inner = ex.InnerException?.Message ?? ex.InnerException?.InnerException?.Message, 
                stackTrace = ex.StackTrace 
            });
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

    [HttpGet("my")]
    public IActionResult MyGoal()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            var goal = _db.Goals
                .Where(x => x.UserId == userId && x.Status == "in_progress")
                .OrderByDescending(x => x.GoalId)
                .FirstOrDefault();

            if (goal == null)
            {
                goal = _db.Goals
                    .Where(x => x.UserId == userId)
                    .OrderByDescending(x => x.GoalId)
                    .FirstOrDefault();
            }

            return Ok(goal);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpGet("check")]
    public IActionResult CheckGoal()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            var goal = _db.Goals.FirstOrDefault(x => x.UserId == userId && x.Status == "in_progress");
            if (goal == null) return Ok(new { message = "No active goal" });

            var latest = _db.ProgressLogs
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Date)
                .FirstOrDefault();

            if (latest == null) return Ok(new { message = "No progress found" });

            bool completed = false;
            if (goal.GoalType == "weight_loss" && latest.Weight <= goal.TargetValue) completed = true;
            if (goal.GoalType == "muscle_gain" && latest.Weight >= goal.TargetValue) completed = true;
            if (goal.GoalType == "fitness" && latest.Bmi >= 18.5 && latest.Bmi < 25.0) completed = true;

            if (completed)
            {
                goal.Status = "completed";
                goal.EndDate = DateTime.Now;
                _db.SaveChanges();
                return Ok(new { status = "completed", goal });
            }

            return Ok(new { status = "in_progress", goal });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpDelete("reset")]
    public IActionResult ResetData()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var goals = _db.Goals.Where(x => x.UserId == userId).ToList();
            var logs = _db.ProgressLogs.Where(x => x.UserId == userId).ToList();

            _db.Goals.RemoveRange(goals);
            _db.ProgressLogs.RemoveRange(logs);

            var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
            if (profile != null)
            {
                profile.Weight = 0;
                profile.Bmi = 0;
                profile.Goal = null;
                profile.WeightCategory = null;
            }

            _db.SaveChanges();
            return Ok("Data reset successful");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
        }
    }
}
