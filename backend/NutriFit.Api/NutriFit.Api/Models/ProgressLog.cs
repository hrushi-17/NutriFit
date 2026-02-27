using System.ComponentModel.DataAnnotations;

public class ProgressLog
{
    [Key]
    public int ProgressId { get; set; }

    public int UserId { get; set; }

    public double Weight { get; set; }
    public double Bmi { get; set; }

    [Required]
    public string WeightCategory { get; set; } = string.Empty;

    public DateTime Date { get; set; } = DateTime.Now;

    // Navigation property
    public User? User { get; set; }
}
