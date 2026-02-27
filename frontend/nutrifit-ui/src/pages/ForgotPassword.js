import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Send OTP to email
  const handleSendOtp = async () => {
    if (!email) {
      setMsg("❌ Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg("❌ Please enter a valid email address");
      return;
    }

    try {
      const res = await api.post("/auth/send-otp", { email });
      setMsg("✅ " + res.data);
      setOtpSent(true);
      setResendTimer(60); // Start timer
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Failed to send OTP"));
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMsg("❌ Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setMsg("✅ OTP verified! Redirecting to reset password...");

      // Redirect to reset password with verification token
      setTimeout(() => {
        navigate(`/reset-password?token=${encodeURIComponent(res.data.verificationToken)}`);
      }, 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Invalid or expired OTP"));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate-fade-up"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="premium-card p-4 p-md-5 w-100 mx-3"
        style={{
          maxWidth: "450px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bolder text-white" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "var(--accent-blue)" }}>RECOVER</span> ACCOUNT
          </h2>
          <p className="text-muted fw-semibold">Reset your password securely</p>
        </div>

        {/* Message Display */}
        {msg && (
          <div
            className={`alert animate-fade-up py-3`}
            style={{
              background: msg.startsWith("✅") ? "rgba(16, 185, 129, 0.1)" : "rgba(229, 9, 20, 0.1)",
              color: msg.startsWith("✅") ? "var(--accent-green)" : "var(--accent-red)",
              border: `1px solid ${msg.startsWith("✅") ? "var(--accent-green)" : "var(--accent-red)"}`,
              fontSize: "0.9rem"
            }}
          >
            {msg}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4 animate-fade-up delay-1">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Email Address</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-regular fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control border-start-0"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={otpSent}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
            />
          </div>
        </div>

        {/* OTP Field (shown after OTP is sent) */}
        {otpSent && (
          <div className="mb-4 animate-fade-up delay-2">
            <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Enter OTP</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                style={{ background: "transparent", borderColor: "var(--border-light)", color: "white", letterSpacing: "2px", fontWeight: "bold" }}
              />
            </div>
          </div>
        )}

        {/* Send OTP / Verify OTP Button */}
        {!otpSent ? (
          <button
            className="btn-netflix w-100 py-3 fs-5 mt-2 animate-fade-up delay-3"
            style={{ background: "var(--accent-blue)" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        ) : (
          <div className="animate-fade-up delay-3">
            <button
              className="btn-health w-100 py-3 fs-5 mb-3"
              onClick={handleVerifyOtp}
            >
              Verify OTP & Continue
            </button>

            {/* Resend OTP Button */}
            <button
              className="btn-outline-glass w-100 py-2"
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
            </button>
          </div>
        )}

        {/* Back to Login */}
        <p className="text-center mt-4 mb-0 animate-fade-up delay-4" style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Remember your password?{" "}
          <span
            className="fw-bold"
            style={{ color: "white", cursor: "pointer", transition: "0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent-blue)"}
            onMouseLeave={e => e.currentTarget.style.color = "white"}
            onClick={() => navigate("/login")}
          >
            Sign in here.
          </span>
        </p>
      </div>
    </div>
  );
}
