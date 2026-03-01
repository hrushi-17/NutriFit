using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System.Net;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;

namespace NutriFit.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public EmailService(IConfiguration config, ILogger<EmailService> logger, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            var brevoKey = _config["Brevo:ApiKey"];

            if (!string.IsNullOrEmpty(brevoKey))
            {
                await SendViaBrevoApi(toEmail, subject, body, brevoKey, isHtml);
            }
            else
            {
                _logger.LogWarning("Brevo:ApiKey is missing. Falling back to (likely blocked) SMTP...");
                await SendViaSmtpFallback(toEmail, subject, body, isHtml);
            }
        }

        private async Task SendViaBrevoApi(string toEmail, string subject, string body, string apiKey, bool isHtml)
        {
            try
            {
                _logger.LogInformation("Attempting to send email to {To} via Brevo HTTP API...", toEmail);

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("api-key", apiKey);

                var payload = new
                {
                    sender = new { name = "NutriFit", email = _config["SMTP:Username"] ?? "noreply@nutrifit.com" },
                    to = new[] { new { email = toEmail } },
                    subject = subject,
                    htmlContent = isHtml ? body : null,
                    textContent = isHtml ? null : body
                };

                var response = await client.PostAsJsonAsync("https://api.brevo.com/v3/smtp/email", payload);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Email sent successfully via Brevo API to {To}", toEmail);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Brevo API failed: {Status} - {Error}", response.StatusCode, error);
                    throw new Exception($"Email API failed: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HTTP Email delivery failed for {To}", toEmail);
                throw;
            }
        }

        private async Task SendViaSmtpFallback(string toEmail, string subject, string body, bool isHtml)
        {
            var smtpHost = _config["SMTP:Host"] ?? "smtp.gmail.com";
            var smtpUser = _config["SMTP:Username"];
            var smtpPass = _config["SMTP:Password"];
            var configPort = int.Parse(_config["SMTP:Port"] ?? "465");

            var portsToTry = new List<(int Port, SecureSocketOptions Options)>
            {
                (configPort, configPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls),
                (465, SecureSocketOptions.SslOnConnect),
                (587, SecureSocketOptions.StartTls)
            };

            portsToTry = portsToTry.GroupBy(x => x.Port).Select(g => g.First()).ToList();
            Exception? lastException = null;

            foreach (var (port, options) in portsToTry)
            {
                try
                {
                    using var smtp = new SmtpClient();
                    smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    smtp.Timeout = 10000;

                    var email = new MimeMessage();
                    email.From.Add(new MailboxAddress("NutriFit", smtpUser));
                    email.To.Add(MailboxAddress.Parse(toEmail));
                    email.Subject = subject;
                    email.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain) { Text = body };

                    await smtp.ConnectAsync(smtpHost, port, options);
                    await smtp.AuthenticateAsync(smtpUser, smtpPass);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);

                    _logger.LogInformation("Email sent successfully via SMTP fallback (Port {Port})", port);
                    return;
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    _logger.LogWarning("SMTP Fallback failed on port {Port}: {Msg}", port, ex.Message);
                }
            }

            throw new Exception("All email delivery methods failed.", lastException);
        }
    }
}
