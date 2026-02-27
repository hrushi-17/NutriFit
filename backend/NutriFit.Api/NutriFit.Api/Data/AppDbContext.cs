using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ==============================
    // MODULE 1 - USERS & ADMINS
    // ==============================
    public DbSet<User> Users { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }

    // ==============================
    // MODULE 2 - HEALTH
    // ==============================
    public DbSet<HealthCondition> HealthConditions { get; set; }
    public DbSet<UserHealthCondition> UserHealthConditions { get; set; }

    // ==============================
    // MODULE 3 - WORKOUT
    // ==============================
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
    public DbSet<WorkoutPlanDetail> WorkoutPlanDetails { get; set; }

    // ? New: User Assigned Workouts
    public DbSet<UserWorkout> UserWorkouts { get; set; }

    // ==============================
    // MODULE 4 - DIET
    // ==============================
    public DbSet<Food> Foods { get; set; }
    public DbSet<DietPlan> DietPlans { get; set; }
    public DbSet<DietPlanFood> DietPlanFoods { get; set; }
    public DbSet<MealLog> MealLogs { get; set; }

    // ? New: User Assigned Diet Foods
    public DbSet<UserDietFood> UserDietFoods { get; set; }

    // ==============================
    // MODULE 5 - PROGRESS & GOALS
    // ==============================
    public DbSet<ProgressLog> ProgressLogs { get; set; }
    public DbSet<Goal> Goals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==============================
        // PROGRESS & GOALS
        // ==============================
        modelBuilder.Entity<ProgressLog>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Goal>()
            .HasOne(g => g.User)
            .WithMany()
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ==============================
        // USER WORKOUT
        // ==============================
        modelBuilder.Entity<UserWorkout>()
            .HasOne(uw => uw.User)
            .WithMany()
            .HasForeignKey(uw => uw.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserWorkout>()
            .HasOne(uw => uw.Workout)
            .WithMany()
            .HasForeignKey(uw => uw.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);

        // ==============================
        // USER DIET FOOD
        // ==============================
        modelBuilder.Entity<UserDietFood>()
            .HasOne(ud => ud.User)
            .WithMany()
            .HasForeignKey(ud => ud.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserDietFood>()
            .HasOne(ud => ud.Food)
            .WithMany()
            .HasForeignKey(ud => ud.FoodId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

