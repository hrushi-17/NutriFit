using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System.Net;
using System.Linq;

namespace NutriFit.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var smtpHost = _config["SMTP:Host"];
                var smtpPort = int.Parse(_config["SMTP:Port"] ?? "587");
                var smtpUser = _config["SMTP:Username"];
                var smtpPass = _config["SMTP:Password"];

                _logger.LogInformation("Attempting to send email to {ToEmail} via {Host}:{Port}", toEmail, smtpHost, smtpPort);

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("NutriFit", smtpUser));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;
                email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain) { Text = body };

                using var smtp = new SmtpClient();
                
                // Connection timeout setting
                smtp.Timeout = 30000; // 30 seconds

                // Force IPv4 for better reliability in cloud environments like Render
                // Many cloud environments have issues with IPv6 and SMTP
                smtp.LocalDomain = "localhost";

                // Use SecureSocketOptions.SslOnConnect for port 465 (Implicit SSL)
                // Use SecureSocketOptions.StartTls for port 587 (Explicit TLS)
                var secureOptions = smtpPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                
                _logger.LogInformation("Connecting to SMTP server {Host}:{Port} with {Options} (Forcing IPv4)...", smtpHost, smtpPort, secureOptions);
                
                try 
                {
                    // Forcing IPv4 address resolution for the host
                    var addresses = await Dns.GetHostAddressesAsync(smtpHost!);
                    var ipv4Address = addresses.FirstOrDefault(a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
                    
                    if (ipv4Address != null)
                    {
                        _logger.LogInformation("Resolved {Host} to IPv4: {IP}", smtpHost, ipv4Address);
                        await smtp.ConnectAsync(ipv4Address.ToString(), smtpPort, secureOptions);
                    }
                    else
                    {
                        _logger.LogWarning("Could not resolve {Host} to an IPv4 address. Falling back to default resolve.", smtpHost);
                        await smtp.ConnectAsync(smtpHost, smtpPort, secureOptions);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "IPv4 connection failed, trying default connection for {Host}.", smtpHost);
                    await smtp.ConnectAsync(smtpHost, smtpPort, secureOptions);
                }
                
                _logger.LogInformation("Authenticating as {User}...", smtpUser);
                await smtp.AuthenticateAsync(smtpUser, smtpPass);
                
                _logger.LogInformation("Sending email to {To}...", toEmail);
                await smtp.SendAsync(email);
                
                _logger.LogInformation("Disconnecting...");
                await smtp.DisconnectAsync(true);
                
                _logger.LogInformation("Email sent successfully to {ToEmail}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {ToEmail} via MailKit", toEmail);
                throw; // Re-throw to handle in controller
            }
        }
    }
}
