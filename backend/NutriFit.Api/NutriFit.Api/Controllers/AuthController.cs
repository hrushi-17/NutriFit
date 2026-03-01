using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Cors;


[ApiController]
[Route("api/auth")]
[EnableCors("AllowFrontend")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext db, IConfiguration config, ILogger<AuthController> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    // =========================
    // ? USER REGISTER (PUBLIC)
    // =========================
    [HttpPost("register-user")]
    public IActionResult RegisterUser(RegisterDto dto)
    {
        try
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Password and Confirm Password do not match.");

            // Normalize email
            string email = dto.Email!.Trim().ToLower();

            if (_db.Users.Any(u => u.Email == email))
                return BadRequest("User already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok("User registered successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // ==================================
    // ? ADMIN REGISTER (SECRET KEY ONLY)
    // ==================================
    [HttpPost("register-admin")]
    public IActionResult RegisterAdmin(AdminRegisterDto dto)
    {
        try
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Password and Confirm Password do not match.");

            var secretFromConfig = _config["AdminSettings:SecretKey"];

            if (dto.SecretKey != secretFromConfig)
                return Unauthorized("Invalid admin secret key");

            // Normalize email
            string email = dto.Email!.Trim().ToLower();

            if (_db.Admins.Any(a => a.Email == email))
                return BadRequest("Admin already exists");

            var admin = new Admin
            {
                Name = dto.Name,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.Admins.Add(admin);
            _db.SaveChanges();

            return Ok("Admin registered successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering admin: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // =========================
    // ? COMMON LOGIN (ADMIN + USER)
    // =========================
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        try
        {
            string email = dto.Email!.Trim().ToLower();

            // ?? Check admin first
            var admin = _db.Admins.FirstOrDefault(x => x.Email == email);
            if (admin != null && BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
            {
                var adminToken = GenerateToken(admin.AdminId, "admin");
                return Ok(new { token = adminToken, role = "admin" });
            }

            // ?? Check user
            var user = _db.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
                return NotFound("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid password");

            var userToken = GenerateToken(user.UserId, "user");
            return Ok(new { token = userToken, role = "user" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // =========================
    // ?? JWT TOKEN CREATOR
    // =========================
    private string GenerateToken(int id, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(6),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // =========================
    // ? SEND OTP (NEW FLOW)
    // =========================
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp(ForgotPasswordDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email is required.");

            string email = dto.Email!.Trim().ToLower();

            // 1. Check User
            var user = _db.Users.FirstOrDefault(x => x.Email == email);
            Admin? admin = null;

            if (user == null)
            {
                // 2. Check Admin
                admin = _db.Admins.FirstOrDefault(x => x.Email == email);
                if (admin == null)
                    return NotFound("User not found");
            }

            // Generate 6-digit OTP
            var random = new Random();
            var otp = random.Next(100000, 999999).ToString();

            // Save OTP
            if (user != null)
            {
                user.OtpCode = otp;
                user.OtpExpiry = DateTime.Now.AddMinutes(1);
                user.OtpVerified = false;
            }
            else if (admin != null)
            {
                admin.OtpCode = otp;
                admin.OtpExpiry = DateTime.Now.AddMinutes(1);
                admin.OtpVerified = false;
            }
            
            await _db.SaveChangesAsync();

            // Send OTP via email
            string targetEmail = user?.Email ?? admin!.Email!;
            string targetName = user?.Name ?? admin!.Name!;

            var smtpHost = _config["SMTP:Host"];
            var smtpPort = int.Parse(_config["SMTP:Port"] ?? "587");
            var smtpUser = _config["SMTP:Username"];
            var smtpPass = _config["SMTP:Password"];

            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUser!, smtpPass!);

                using (var mail = new MailMessage())
                {
                    mail.From = new MailAddress(smtpUser!, "NutriFit");
                    mail.To.Add(targetEmail);

                    mail.Subject = "Your Password Reset OTP";
                    mail.IsBodyHtml = true;
                    mail.Body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>
                            <h2 style='color: #0d6efd; text-align: center;'>NutriFit Password Reset</h2>
                            <p style='font-size: 16px; color: #333;'>Hi <strong>{targetName}</strong>,</p>
                            <p style='font-size: 16px; color: #333;'>You requested to reset your password. Use the OTP below to proceed:</p>
                            
                            <div style='text-align: center; margin: 20px 0;'>
                                <span style='font-size: 24px; font-weight: bold; color: #333; letter-spacing: 5px; background: #f8f9fa; padding: 10px 20px; border-radius: 5px; border: 1px solid #ddd;'>{otp}</span>
                            </div>

                            <p style='font-size: 14px; color: #666; text-align: center;'>This OTP is valid for <strong>1 minute</strong>.</p>
                            <p style='font-size: 14px; color: #999; text-align: center; margin-top: 20px;'>If you did not request this, please ignore this email.</p>
                            
                            <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
                            <p style='font-size: 12px; color: #aaa; text-align: center;'>&copy; {DateTime.Now.Year} NutriFit. All rights reserved.</p>
                        </div>";
                    
                    await client.SendMailAsync(mail);
                }
            }

            return Ok("OTP sent to your email successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending OTP to email: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // =========================
    // ? VERIFY OTP (NEW FLOW)
    // =========================
    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp(VerifyOtpDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Otp))
                return BadRequest("Email and OTP are required.");

            dto.Email = dto.Email!.Trim().ToLower();

            var user = _db.Users.FirstOrDefault(x => x.Email == dto.Email);
            Admin? admin = null;

            if (user == null)
            {
                admin = _db.Admins.FirstOrDefault(x => x.Email == dto.Email);
                if (admin == null)
                    return NotFound("User not found");
            }

            bool isUser = user != null;
            string? code = isUser ? user!.OtpCode : admin!.OtpCode;
            DateTime? expiry = isUser ? user!.OtpExpiry : admin!.OtpExpiry;

            // Check if OTP matches and is not expired
            if (code != dto.Otp)
                return BadRequest("Invalid OTP");

            if (expiry == null || expiry < DateTime.Now)
                return BadRequest("OTP has expired");

            // Generate a verification token for reset password
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var verificationToken = Convert.ToBase64String(tokenBytes);

            if (isUser)
            {
                user!.OtpVerified = true;
                user.ResetToken = verificationToken;
                user.ResetTokenExpiry = DateTime.Now.AddMinutes(15);
            }
            else
            {
                admin!.OtpVerified = true;
                admin.ResetToken = verificationToken;
                admin.ResetTokenExpiry = DateTime.Now.AddMinutes(15);
            }
            
            _db.SaveChanges();

            return Ok(new { verificationToken });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying OTP for email: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // =========================
    // ? FORGOT PASSWORD (SMTP EMAIL)
    // =========================
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email is required.");

            var user = _db.Users.FirstOrDefault(x => x.Email == dto.Email);
            if (user == null)
                return NotFound("User not found");

            // Generate secure token
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var token = Convert.ToBase64String(tokenBytes);

            // Save token and expiry in DB
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.Now.AddHours(1);
            await _db.SaveChangesAsync();

            // Send email
            if (string.IsNullOrEmpty(user.Email))
                return BadRequest("User email is not set.");

            var smtpHost = _config["SMTP:Host"];
            var smtpPort = int.Parse(_config["SMTP:Port"] ?? "587");
            var smtpUser = _config["SMTP:Username"];
            var smtpPass = _config["SMTP:Password"];
            var frontendUrl = _config["FrontendUrl"];

            // Encode token for safe URL
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";

            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUser!, smtpPass!);

                using (var mail = new MailMessage())
                {
                    mail.From = new MailAddress(smtpUser!, "NutriFit");

                    if (!string.IsNullOrEmpty(user.Email))
                        mail.To.Add(user.Email);

                    mail.Subject = "Reset Your Password";
                    mail.Body = $"Hi {user.Name},\n\nClick this link to reset your password:\n{resetLink}\n\nThis link expires in 1 hour.";
                    await client.SendMailAsync(mail);
                }
            }

            return Ok("Reset password link sent to your email.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing forgot password for email: {Email}", dto.Email);
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    // =========================
    // ? RESET PASSWORD (SECURE)
    // =========================
    [HttpPost("reset-password")]
    public IActionResult ResetPassword(ResetPasswordDto dto)
    {
        try
        {
            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("New Password and Confirm Password do not match.");

            if (string.IsNullOrEmpty(dto.Token))
                return BadRequest("Invalid or missing reset token.");

            // Decode token to handle URL encoding
            var token = Uri.UnescapeDataString(dto.Token);

            var user = _db.Users.FirstOrDefault(u =>
                u.ResetToken == token && u.ResetTokenExpiry > DateTime.Now);

            Admin? admin = null;
            if (user == null)
            {
                admin = _db.Admins.FirstOrDefault(u =>
                    u.ResetToken == token && u.ResetTokenExpiry > DateTime.Now);
                
                if (admin == null)
                     return BadRequest("Invalid or expired token.");
            }

            // Update password
            // Update password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            if (user != null)
                user.Password = hashedPassword;
            else
                admin!.Password = hashedPassword;

            // ? Security: clear token and expiry after reset
            if (user != null)
            {
                user.ResetToken = null;
                user.ResetTokenExpiry = null;
            }
            else
            {
                admin!.ResetToken = null;
                admin!.ResetTokenExpiry = null;
            }

            _db.SaveChanges();

            return Ok("Password reset successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing reset password");
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }
}

