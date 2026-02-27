public class RegisterDto
{
    public required string Name { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
    public required string ConfirmPassword { get; set; } = string.Empty; // ✅ Added
}

public class AdminRegisterDto
{
    public required string Name { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
    public required string ConfirmPassword { get; set; } = string.Empty; // ✅ Added
    public required string SecretKey { get; set; } = string.Empty;
}

