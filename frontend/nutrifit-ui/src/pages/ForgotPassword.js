import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!email) {
      setMsg("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg("Please enter a valid email address");
      return;
    }

    try {
      const res = await api.post("/auth/send-otp", { email });
      setMsg("OTP sent to your email.");
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      setMsg(err.response?.data || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMsg("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setMsg("OTP verified! Redirecting to reset password...");

      setTimeout(() => {
        navigate(`/reset-password?token=${encodeURIComponent(res.data.verificationToken)}`);
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data || "Invalid or expired OTP");
    }
  };

  return (
    <div className="auth-background animate-fade-up">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h1 className="auth-title">Account Recovery</h1>
        <p className="auth-label mb-4">Reset your password securely.</p>

        {msg && (
          <div className="alert mb-4" style={{ background: "#e87c03", color: "white", border: "none", borderRadius: "4px", padding: "10px 20px" }}>
            {msg}
          </div>
        )}

        <div className="auth-input-group animate-fade-up delay-1">
          <input
            type="email"
            className="netflix-input"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={otpSent}
          />
        </div>

        {otpSent && (
          <div className="auth-input-group animate-fade-up delay-2">
            <input
              type="text"
              className="netflix-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              style={{ letterSpacing: "2px", fontWeight: "bold", textAlign: "center" }}
            />
          </div>
        )}

        {!otpSent ? (
          <button
            className="btn-netflix w-100 py-3 fs-5 mt-4 animate-fade-up delay-3"
            onClick={handleSendOtp}
          >
            Send Verification Code
          </button>
        ) : (
          <div className="animate-fade-up delay-3 mt-4">
            <button
              className="btn-netflix w-100 py-3 fs-5 mb-3"
              onClick={handleVerifyOtp}
            >
              Verify Code
            </button>

            <button
              className="btn-outline-glass w-100 py-2"
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : "Resend Code"}
            </button>
          </div>
        )}

        <div className="auth-footer-text text-center animate-fade-up delay-4 mt-5">
          Remember your password? <Link to="/login" className="auth-footer-link">Sign in.</Link>
        </div>
      </div>
    </div>
  );
}
