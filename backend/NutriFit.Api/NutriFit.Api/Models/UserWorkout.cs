using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserWorkout
{
    [Key]
    public int UserWorkoutId { get; set; }

    public int UserId { get; set; }

    public int WorkoutId { get; set; }

    [Required]
    public string DayName { get; set; } = string.Empty;

    [Column(TypeName = "int")]
    public int? DurationMinutes { get; set; }

    // Navigation properties
    public User? User { get; set; }
    public Workout? Workout { get; set; }
}
