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
            var smtpHost = _config["SMTP:Host"] ?? "smtp.gmail.com";
            var smtpUser = _config["SMTP:Username"];
            var smtpPass = _config["SMTP:Password"];
            var configPort = int.Parse(_config["SMTP:Port"] ?? "465");

            // List of ports to try in sequence
            var portsToTry = new List<(int Port, SecureSocketOptions Options)>
            {
                (configPort, configPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls),
                (465, SecureSocketOptions.SslOnConnect),
                (587, SecureSocketOptions.StartTls),
                (2525, SecureSocketOptions.StartTls) // Common fallback port
            };

            // Remove duplicates and the configured port (if it's already in the list)
            portsToTry = portsToTry.GroupBy(x => x.Port).Select(g => g.First()).ToList();

            Exception? lastException = null;

            foreach (var (port, options) in portsToTry)
            {
                try
                {
                    _logger.LogInformation("Attempting SMTP: {Host}:{Port} with {Options}", smtpHost, port, options);

                    using var smtp = new SmtpClient();
                    
                    // DIAGNOSTIC: Accept all certificates to bypass handshake stalls
                    smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    smtp.Timeout = 15000; // 15s per attempt

                    var email = new MimeMessage();
                    email.From.Add(new MailboxAddress("NutriFit", smtpUser));
                    email.To.Add(MailboxAddress.Parse(toEmail));
                    email.Subject = subject;
                    email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain) { Text = body };

                    await smtp.ConnectAsync(smtpHost, port, options);
                    await smtp.AuthenticateAsync(smtpUser, smtpPass);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);

                    _logger.LogInformation("Email sent successfully via port {Port}", port);
                    return; // Success!
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    _logger.LogWarning("Failed to send via port {Port}: {Msg}", port, ex.Message);
                    // Continue to next port
                }
            }

            _logger.LogError(lastException, "All SMTP delivery attempts failed for {To}", toEmail);
            throw new Exception("All SMTP delivery attempts failed. Check logs for details.", lastException);
        }
    }
}
