using System.ComponentModel.DataAnnotations;

public class UserDietFood
{
    [Key]
    public int UserDietFoodId { get; set; }

    public int UserId { get; set; }

    public int FoodId { get; set; }

    [Required]
    public string MealType { get; set; } = string.Empty;

    // Navigation properties
    public User? User { get; set; }
    public Food? Food { get; set; }
}
