import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/pages/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setMsg("⏳ Sending OTP... Please wait");
      const res = await api.post("/auth/send-otp", { email });
      setMsg("✅ " + res.data);
      setOtpSent(true);
      setResendTimer(60); // Start timer
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMsg("❌ Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setMsg("⏳ Verifying OTP...");
      const res = await api.post("/auth/verify-otp", { email, otp });
      setMsg("✅ OTP verified! Redirecting to reset password...");

      // Redirect to reset password with verification token
      setTimeout(() => {
        navigate(`/reset-password?token=${encodeURIComponent(res.data.verificationToken)}`);
      }, 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Invalid or expired OTP"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg" style={{ maxWidth: "800px" }}>
        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title"><i className="fa-solid fa-lock me-2 text-danger"></i><br />RECOVERY</h1>
          <p className="auth-graphic-subtitle mt-3">Reset your access token.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <h3 className="auth-title">Forgot Password</h3>

          {/* Message Display */}
          {msg && (
            <div
              className={`alert ${msg.startsWith("✅") ? "alert-success border-0 bg-success text-white" : "alert-danger border-0 bg-danger text-white"} py-2 mb-3 rounded`}
              style={{ fontSize: "0.9rem" }}
            >
              {msg}
            </div>
          )}

          {/* Email Field */}
          <div className="auth-input-group animate-fade-up delay-1">
            <label className="auth-label text-light fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control netflix-input"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={otpSent}
            />
          </div>

          {/* OTP Field (shown after OTP is sent) */}
          {otpSent && (
            <div className="auth-input-group animate-fade-up delay-2 mt-3">
              <label className="auth-label text-light fw-semibold">Enter OTP</label>
              <input
                type="text"
                className="form-control netflix-input text-center fw-bold text-white letter-spacing-2"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                style={{ fontSize: "1.5rem", letterSpacing: "8px" }}
              />
            </div>
          )}

          {/* Send OTP / Verify OTP Button */}
          {!otpSent ? (
            <button
              className="btn btn-netflix w-100 mt-4 animate-fade-up delay-3"
              style={{ padding: "14px", fontSize: "1.05rem" }}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Sending OTP...</>
              ) : "Send OTP"}
            </button>
          ) : (
            <>
              <button
                className="btn btn-netflix w-100 mt-4 mb-2 animate-fade-up delay-3"
                style={{ padding: "14px", fontSize: "1.05rem" }}
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Verifying...</>
                ) : "Verify OTP"}
              </button>

              {/* Resend OTP Button */}
              <button
                className="btn btn-outline-glass w-100 animate-fade-up delay-4 fw-bold border"
                style={{ padding: "12px" }}
                onClick={handleSendOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
              </button>
            </>
          )}

          {/* Back to Login */}
          <div className="auth-footer-text animate-fade-up delay-5 text-center mt-4">
            Remember your password? <Link to="/login" className="auth-footer-link">Sign In.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
