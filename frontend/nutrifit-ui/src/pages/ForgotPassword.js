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
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "transparent" }}
    >
      <div
        className="card netflix-card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h3 className="text-center mb-4" style={{ fontWeight: "600", color: "#fff" }}>
          Forgot Password
        </h3>

        {/* Message Display */}
        {msg && (
          <div
            className={`alert ${msg.startsWith("✅") ? "alert-success" : "alert-danger"} py-2 mb-3`}
            style={{ fontSize: "0.9rem" }}
          >
            {msg}
          </div>
        )}

        {/* Email Field */}
        <label className="form-label" style={{ fontWeight: "500" }}>Email Address</label>
        <input
          type="email"
          className="form-control netflix-input mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {/* OTP Field (shown after OTP is sent) */}
        {otpSent && (
          <>
            <label className="form-label" style={{ fontWeight: "500" }}>Enter OTP</label>
            <input
              type="text"
              className="form-control netflix-input mb-3"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </>
        )}

        {/* Send OTP / Verify OTP Button */}
        {!otpSent ? (
          <button
            className="btn btn-netflix w-100 mb-3"
            style={{
              padding: "12px",
              fontWeight: "500",
              borderRadius: "8px",
              background: "transparent"
            }}
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        ) : (
          <>
            <button
              className="btn btn-netflix w-100 mb-2"
              style={{
                padding: "12px",
                fontWeight: "500",
                borderRadius: "8px",
                background: "transparent"
              }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>

            {/* Resend OTP Button */}
            <button
              className="btn btn-outline-secondary w-100"
              style={{
                padding: "10px",
                fontWeight: "500",
                borderRadius: "8px"
              }}
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
            </button>
          </>
        )}

        {/* Back to Login */}
        <p className="text-center mt-3" style={{ fontSize: "0.9rem", color: "#fff" }}>
          Remember your password? <span
            style={{ color: "#007bff", cursor: "pointer", fontWeight: "500" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
