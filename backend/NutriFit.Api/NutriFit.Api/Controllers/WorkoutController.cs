using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


[Authorize]
[ApiController]
[Route("api/workout")]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _db;

    public WorkoutController(AppDbContext db)
    {
        _db = db;
    }

    // ================================
    // ? GET WEEKLY WORKOUT PLAN (DYNAMIC)
    // ================================
    [HttpGet("weekly-plan")]
    public IActionResult GetWeeklyWorkoutPlan()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ? ADMIN DELETE SAFETY CHECK
        var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
        if (validUser == null)
            return Unauthorized("User no longer exists. Please register again.");

        var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
        if (profile == null)
            return BadRequest("User profile not found");

        int conditionId = _db.UserHealthConditions
            .Where(x => x.UserId == userId)
            .Select(x => x.HealthConditionId)
            .FirstOrDefault();

        if (conditionId == 0)
            conditionId = 1; // None

        // ================================
        // ? FIND PLAN
        // ================================
        string mappedGoal = profile.Goal!.Trim().ToLower() == "weight_loss" ? "Weight Loss" 
                         : profile.Goal!.Trim().ToLower() == "muscle_gain" ? "Muscle Gain" 
                         : "Fitness";
        string mappedCategory = (profile.WeightCategory ?? "normal").ToLower() == "low" ? "Underweight"
                              : (profile.WeightCategory ?? "normal").ToLower() == "normal" ? "Normal"
                              : "Overweight";
        string mappedActivity = (profile.ActivityLevel ?? "Medium").ToLower() == "low" ? "Low"
                              : (profile.ActivityLevel ?? "Medium").ToLower() == "high" ? "High"
                              : "Medium";

        var plan = _db.WorkoutPlans.FirstOrDefault(p =>
            p.Goal == mappedGoal &&
            p.WeightCategory == mappedCategory &&
            p.ActivityLevel == mappedActivity &&
            p.HealthConditionId == conditionId
        );

        // Fallback 1: Try with HealthConditionId = 1 (None)
        if (plan == null)
        {
            plan = _db.WorkoutPlans.FirstOrDefault(p =>
                p.Goal == mappedGoal &&
                p.WeightCategory == mappedCategory &&
                p.ActivityLevel == mappedActivity &&
                p.HealthConditionId == 1
            );
        }

        // Fallback 2: Ignore ActivityLevel, use Medium
        if (plan == null)
        {
            plan = _db.WorkoutPlans.FirstOrDefault(p =>
                p.Goal == mappedGoal &&
                p.WeightCategory == mappedCategory &&
                p.ActivityLevel == "Medium" &&
                p.HealthConditionId == 1
            );
        }

        // Fallback 3: Use most generic plan (Fitness, Normal, Medium, None)
        if (plan == null)
        {
            plan = _db.WorkoutPlans.FirstOrDefault(p =>
                p.Goal == "Fitness" &&
                p.WeightCategory == "Normal" &&
                p.ActivityLevel == "Medium" &&
                p.HealthConditionId == 1
            );
        }

        // This should never happen if database is properly seeded
        if (plan == null)
            return BadRequest("No suitable workout plan found. Please contact support.");

        // ================================
        // ? RETURN WEEKLY PLAN
        // ================================
        // ================================
        // ? RETURN WEEKLY PLAN (AND SAVE TO DB)
        // ================================
        
        // 1. Fetch details
        var planDetails = _db.WorkoutPlanDetails
            .Where(d => d.PlanId == plan.PlanId)
            .ToList();

        // 2. Clear existing UserWorkouts for this user (Snapshot logic)
        //    User asked to "override"
        var existingUserWorkouts = _db.UserWorkouts.Where(x => x.UserId == userId).ToList();
        if (existingUserWorkouts.Any())
        {
            _db.UserWorkouts.RemoveRange(existingUserWorkouts);
        }

        // 3. Insert new UserWorkouts
        var newUserWorkouts = planDetails.Select(d => new UserWorkout
        {
            UserId = userId,
            WorkoutId = d.WorkoutId,
            DayName = d.DayName,
            DurationMinutes = d.DurationMinutes
        }).ToList(); // Assuming UserWorkout entity exists and matches db

        _db.UserWorkouts.AddRange(newUserWorkouts);
        _db.SaveChanges(); // Persist to DB for Admin View

        var data =
            from d in _db.WorkoutPlanDetails
            join w in _db.Workouts on d.WorkoutId equals w.WorkoutId
            where d.PlanId == plan.PlanId
            orderby
                d.DayName == "Monday" ? 1 :
                d.DayName == "Tuesday" ? 2 :
                d.DayName == "Wednesday" ? 3 :
                d.DayName == "Thursday" ? 4 :
                d.DayName == "Friday" ? 5 :
                d.DayName == "Saturday" ? 6 : 7
            select new
            {
                d.DayName,
                w.WorkoutName,
                w.WorkoutType,
                w.Intensity,
                d.DurationMinutes,
                w.HealthSafe
            };

        return Ok(data.ToList());
    }
}

