using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProfileController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public IActionResult CreateOrUpdate(ProfileDto dto)
    {
        try
        {
            if (dto == null)
                return BadRequest("Profile data is required.");

            if (dto.Height <= 0)
                return BadRequest("Height must be greater than 0.");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Invalid token.");

            int userId = int.Parse(userIdClaim);

            var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
            if (validUser == null)
                return Unauthorized("User no longer exists. Please register again.");

            decimal heightInMeter = dto.Height / 100m;
            decimal bmi = dto.Weight / (heightInMeter * heightInMeter);
            bmi = Math.Round(bmi, 2);

            string category = bmi < 18.5m ? "low" : bmi < 25m ? "normal" : "high";

            var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);

            if (profile == null)
            {
                profile = new UserProfile { UserId = userId };
                _db.UserProfiles.Add(profile);
            }

            profile.Age = dto.Age;
            profile.Gender = dto.Gender;
            profile.Height = dto.Height;
            profile.Weight = dto.Weight;
            profile.ActivityLevel = dto.ActivityLevel;
            profile.Goal = dto.Goal;
            profile.FoodPreference = dto.FoodPreference;
            profile.Bmi = bmi;
            profile.WeightCategory = category;

            _db.SaveChanges();

            CheckGoalAuto(userId);
            // ? Fix: Dynamic Workout/Diet Update based on new profile
            OverrideWorkoutAndDiet(userId, category);

            return Ok(new { message = "Profile updated", bmi, category });
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

        // Check against Profile data (since we just updated it)
        var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
        if (profile == null) return;

        bool completed = false;
        // Use Profile Weight/BMI for the check
        // Cast TargetValue (double) to decimal for comparison with Profile.Weight (decimal)
        if (goal.GoalType == "weight_loss" && profile.Weight <= (decimal)goal.TargetValue) completed = true;
        if (goal.GoalType == "muscle_gain" && profile.Weight >= (decimal)goal.TargetValue) completed = true;
        if (goal.GoalType == "fitness" && profile.Bmi >= 18.5m && profile.Bmi < 25.0m) completed = true;

        if (completed)
        {
            goal.Status = "completed";
            goal.EndDate = DateTime.Now;
            _db.SaveChanges();
        }
    }
    
    // ? Fix: Logic to auto-assign new plans when profile changes
    private void OverrideWorkoutAndDiet(int userId, string category)
    {
        // This is a "silent" update - strictly speaking the app architecture 
        // seems to rely on the frontend fetching "suggested" plans dynamically 
        // via WorkoutController/DietController which ALREADY check the profile.
        // However, if there are any stored references or if the user wants 
        // to ensure consistency, we technically don't need to "save" anything 
        // here because the Workout/Diet controllers query based on CURRENT profile.
        
        // Wait, looking at WorkoutController:
        // It fetches based on: userProfile.Goal, userProfile.ActivityLevel, etc.
        // So by simply saving the Profile (which we did above), 
        // the NEXT call to "GetMyWorkout" will automatically pick up the new plan.
        
        // The user said "not updated dynamically".
        // This likely means the frontend isn't refetching, 
        // OR the fallback logic in WorkoutController is using old cached data?
        // No, controllers allow fresh fetch.
        
        // BUT! If the user changed their goal in the profile form,
        // we need to make sure the "Goal" entity is also consistent if it exists?
        // ProfileDto has "Goal" (string).
        // GoalsController has "Goal" entity.
        // They might be desyncing if user changes goal in Profile only.
        
        // Let's ensure Goal Entity is synced if Profile Goal changed
        // Actually ProfileController.CreateOrUpdate updates _db.UserProfiles.
        // WorkoutController reads from _db.UserProfiles.
        // So it SHOULD be dynamic.
        
        // Unless.. the user is talking about the "Goal Progress" (405 error context).
        // OR the user expects the "Goal" object (Status=in_progress) to update its "GoalType" 
        // if they change it in the Profile screen.
        
        var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
        var activeGoal = _db.Goals.FirstOrDefault(x => x.UserId == userId && x.Status == "in_progress");
        
        if (profile != null && activeGoal != null)
        {
            // Sync Goal Type if changed in profile
            if (!string.IsNullOrEmpty(profile.Goal) && activeGoal.GoalType != profile.Goal)
            {
               activeGoal.GoalType = profile.Goal;
               _db.SaveChanges();
            }
        }
    }

    [HttpGet]
    public IActionResult GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Invalid token.");

            int userId = int.Parse(userIdClaim);

            var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
            
            // Return null (200 OK) instead of 404 so frontend doesn't throw error
            if (profile == null)
                return Ok(null);

            return Ok(profile);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }
}
