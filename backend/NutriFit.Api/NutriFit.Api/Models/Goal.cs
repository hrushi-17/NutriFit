using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Goal
{
    [Key]
    public int GoalId { get; set; }

    public int UserId { get; set; }

    [Required]
    public string GoalType { get; set; } = string.Empty; // weight_loss, muscle_gain, fitness

    public double TargetValue { get; set; }

    public DateTime StartDate { get; set; } = DateTime.Now;

    public DateTime EndDate { get; set; } = DateTime.Now; // Not nullable in DB

    [Required]
    public string Status { get; set; } = "in_progress"; // in_progress, completed

    // Navigation property
    public User? User { get; set; }
}
