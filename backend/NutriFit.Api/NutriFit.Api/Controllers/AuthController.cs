using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Cors;
using NutriFit.Api.Services;


[ApiController]
[Route("api/auth")]
[EnableCors("AllowFrontend")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;
    private readonly IEmailService _emailService;

    public AuthController(AppDbContext db, IConfiguration config, ILogger<AuthController> logger, IEmailService emailService)
    {
        _db = db;
        _config = config;
        _logger = logger;
        _emailService = emailService;
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

            // Send OTP via email using MailKit Service
            string targetEmail = user?.Email ?? admin!.Email!;
            string targetName = user?.Name ?? admin!.Name!;
            
            string subject = "🔒 Your NutriFit Access Code";
            string body = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <link href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;700&display=swap' rel='stylesheet'>
                </head>
                <body style='margin: 0; padding: 0; background-color: #000000; font-family: ""Roboto"", sans-serif;'>
                    <div style='max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #141414 0%, #000000 100%); border: 1px solid rgba(229, 9, 20, 0.2); border-top: 4px solid #e50914; box-shadow: 0 20px 50px rgba(0,0,0,0.8);'>
                        
                        <!-- Header / Branded Logo Area -->
                        <div style='padding: 50px 20px 30px; text-align: center;'>
                             <div style='font-family: ""Bebas Neue"", sans-serif; font-size: 52px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; line-height: 1;'>
                                <span style='color: #e50914; text-shadow: 0 0 15px rgba(229, 9, 20, 0.5);'>NUTRI</span><span style='color: #ffffff;'>FIT</span>
                            </div>
                            <div style='height: 3px; width: 80px; background: linear-gradient(90deg, transparent, #e50914, transparent); margin: 20px auto 0;'></div>
                        </div>

                        <!-- Cinematic Main Content -->
                        <div style='padding: 0 50px 50px; text-align: center;'>
                            <h2 style='color: #ffffff; font-size: 28px; margin-bottom: 15px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;'>Verification Required</h2>
                            <p style='color: #b3b3b3; font-size: 16px; line-height: 1.8; margin-bottom: 40px;'>
                                Hello {targetName},<br>
                                Secure your account with the cinematic access code below. This code is unique to your session.
                            </p>

                            <!-- Hero OTP Display -->
                            <div style='background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 15px; margin-bottom: 40px; box-shadow: inset 0 0 20px rgba(229, 9, 20, 0.1), 0 15px 35px rgba(0,0,0,0.6);'>
                                <div style='font-family: ""Bebas Neue"", sans-serif; font-size: 72px; font-weight: 900; color: #ffffff; letter-spacing: 18px; margin: 0; text-shadow: 0 0 25px rgba(229, 9, 20, 0.6);'>
                                    {otp}
                                </div>
                                <div style='height: 1px; width: 100%; background: rgba(255,255,255,0.1); margin: 20px 0;'></div>
                                <p style='color: #e50914; font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0; letter-spacing: 3px;'>Valid for 60 seconds</p>
                            </div>

                            <p style='color: #666666; font-size: 14px; font-style: italic;'>
                                If you did not request this code, please ignore this email. Your NutriFit account remains protected.
                            </p>
                        </div>

                        <!-- Branded Footer Matching Website -->
                        <div style='padding: 40px; background-color: rgba(10, 10, 10, 0.8); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;'>
                            <div style='margin-bottom: 20px;'>
                                <span style='color: #e50914; font-weight: 700; font-size: 14px;'>NUTRI</span><span style='color: #ffffff; font-weight: 700; font-size: 14px;'>FIT</span>
                            </div>
                            <p style='color: #888888; font-size: 12px; line-height: 1.6; margin: 0;'>
                                &copy; {DateTime.Now.Year} NutriFit Premium. All rights reserved.<br>
                                <span style='color: #555555;'>Designed & Developed by</span> <span style='color: #e50914; font-weight: 700;'>Hrushikesh Chothe</span><br>
                                <span style='color: #444444;'>Pune, Maharashtra, India</span>
                            </p>
                        </div>
                    </div>
                </body>
                </html>";

            await _emailService.SendEmailAsync(targetEmail, subject, body);

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

            // Send email using MailKit
            if (string.IsNullOrEmpty(user.Email))
                return BadRequest("User email is not set.");

            var frontendUrl = _config["FrontendUrl"];
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";
            
            string subject = "Reset Your Password";
            string body = $"Hi {user.Name},\n\nClick this link to reset your password:\n{resetLink}\n\nThis link expires in 1 hour.";

            await _emailService.SendEmailAsync(user.Email, subject, body, false);

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

