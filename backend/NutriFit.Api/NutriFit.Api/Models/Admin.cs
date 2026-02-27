
public class Admin
{
    public int AdminId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // ?? Forgot Password
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }

    // ?? OTP for Password Reset
    public string? OtpCode { get; set; }
    public DateTime? OtpExpiry { get; set; }
    public bool OtpVerified { get; set; } = false;
}

