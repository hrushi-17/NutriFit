using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


[Authorize]
[ApiController]
[Route("api/diet")]
public class DietController : ControllerBase
{
    private readonly AppDbContext _db;

    public DietController(AppDbContext db)
    {
        _db = db;
    }

    // ==========================================
    // ? GET DAILY DIET PLAN (FULLY DYNAMIC)
    // ==========================================
    [HttpGet("daily-plan")]
    public IActionResult GetDailyDietPlan()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ? ADMIN DELETE SAFETY CHECK
        var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
        if (validUser == null)
            return Unauthorized("User no longer exists. Please register again.");

        var profile = _db.UserProfiles.FirstOrDefault(x => x.UserId == userId);
        if (profile == null)
            return BadRequest("User profile not found");

        // ================================
        // ? BMI ? WeightCategory (AUTO)
        // ================================
        string weightCategory;

        if (profile.Bmi < 18.5m)
            weightCategory = "Underweight";
        else if (profile.Bmi < 25.0m)
            weightCategory = "Normal";
        else
            weightCategory = "Overweight";

        // ================================
        // ? Normalize user values
        // ================================
        string goal = profile.Goal!.Trim().ToLower() == "weight_loss" ? "Weight Loss" 
                    : profile.Goal!.Trim().ToLower() == "muscle_gain" ? "Muscle Gain" 
                    : "Fitness";
        string foodPref = profile.FoodPreference!.Trim(); // Already capitalized in many cases, but let's be safe
        if (foodPref.ToLower() == "vegan") foodPref = "Vegan";
        if (foodPref.ToLower() == "vegetarian") foodPref = "Vegetarian";
        if (foodPref.ToLower() == "non-vegetarian") foodPref = "Non-Vegetarian";

        // ================================
        // ? Get main health condition
        // ================================
        int conditionId = _db.UserHealthConditions
            .Where(x => x.UserId == userId)
            .Select(x => x.HealthConditionId)
            .FirstOrDefault();

        if (conditionId == 0)
            conditionId = 1; // None

        // ================================
        // ? EXACT MATCH (ALL PROFILE BASED)
        // ================================
        var plan = _db.DietPlans.FirstOrDefault(p =>
            p.Goal == goal &&
            p.WeightCategory == weightCategory &&
            p.FoodPreference == foodPref &&
            p.ConditionId == conditionId
        );

        // ================================
        // ? Fallback 1: Try with ConditionId = 1 (None)
        // ================================
        if (plan == null)
        {
            plan = _db.DietPlans.FirstOrDefault(p =>
                p.Goal == goal &&
                p.WeightCategory == weightCategory &&
                p.FoodPreference == foodPref &&
                p.ConditionId == 1
            );
        }

        // Fallback 2: Ignore WeightCategory, use Normal
        if (plan == null)
        {
            plan = _db.DietPlans.FirstOrDefault(p =>
                p.Goal == goal &&
                p.WeightCategory == "Normal" &&
                p.FoodPreference == foodPref &&
                p.ConditionId == 1
            );
        }

        // Fallback 3: Most generic plan (Fitness, Normal, user's food preference, None)
        if (plan == null)
        {
            plan = _db.DietPlans.FirstOrDefault(p =>
                p.Goal == "Fitness" &&
                p.WeightCategory == "Normal" &&
                p.FoodPreference == foodPref &&
                p.ConditionId == 1
            );
        }

        // This should never happen if database is properly seeded
        if (plan == null)
            return BadRequest("No suitable diet plan found. Please contact support.");

        // ================================
        // ? LOAD DAILY DIET (Morning ? Night)
        // ================================
        // ================================
        // ? LOAD DAILY DIET (AND SAVE TO DB)
        // ================================

        // 1. Fetch details
        var planFoods = _db.DietPlanFoods
            .Where(d => d.DietId == plan.DietId)
            .ToList();

        // 2. Clear existing UserDietFoods
        var existingUserDiets = _db.UserDietFoods.Where(x => x.UserId == userId).ToList();
        if (existingUserDiets.Any())
        {
            _db.UserDietFoods.RemoveRange(existingUserDiets);
        }

        // 3. Insert new UserDietFoods
        var newUserDiets = planFoods.Select(f => new UserDietFood
        {
            UserId = userId,
            FoodId = f.FoodId,
            MealType = f.MealType
        }).ToList();

        _db.UserDietFoods.AddRange(newUserDiets);
        _db.SaveChanges(); // Persist for Admin

        var data =
            from d in _db.DietPlanFoods
            join f in _db.Foods on d.FoodId equals f.FoodId
            where d.DietId == plan.DietId
            orderby
                d.MealType == "breakfast" ? 1 :
                d.MealType == "snack" ? 2 :
                d.MealType == "lunch" ? 3 :
                d.MealType == "snack2" ? 4 : 5
            select new
            {
                d.MealType,
                f.FoodName,
                f.Calories,
                f.Protein,
                f.Carbs,
                f.Fat,
                f.GlycemicIndex,
                f.SodiumContent
            };

        return Ok(data.ToList());
    }

    // ==========================================
    // ? ADD MEAL LOG
    // ==========================================
    [HttpPost("log-meal")]
    public IActionResult LogMeal([FromBody] MealLog model)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ? ADMIN DELETE SAFETY CHECK
        var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
        if (validUser == null)
            return Unauthorized("User no longer exists. Please register again.");

        model.UserId = userId;
        model.Date = DateTime.Now;

        _db.MealLogs.Add(model);
        _db.SaveChanges();

        return Ok(new { message = "Meal logged successfully" });
    }

    // ==========================================
    // ? GET TODAY MEAL LOGS
    // ==========================================
    [HttpGet("today-logs")]
    public IActionResult GetTodayMeals()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ? ADMIN DELETE SAFETY CHECK
        var validUser = _db.Users.FirstOrDefault(x => x.UserId == userId);
        if (validUser == null)
            return Unauthorized("User no longer exists. Please register again.");

        DateTime today = DateTime.Today;

        var data =
            from m in _db.MealLogs
            join f in _db.Foods on m.FoodId equals f.FoodId
            where m.UserId == userId && m.Date.Date == today
            select new
            {
                m.MealType,
                m.Quantity,
                f.FoodName,
                f.Calories,
                f.Protein,
                f.Carbs,
                f.Fat
            };

        return Ok(data.ToList());
    }
}

