import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // token from query string
  const navigate = useNavigate();

  const [data, setData] = useState({ newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async () => {
    // ✅ Password strength validation
    if (!passwordRegex.test(data.newPassword)) {
      setMsg("❌ Password does not meet the required criteria. Please check the requirements below.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMsg("❌ Passwords do not match!");
      return;
    }

    try {
      // Call backend API to reset password
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      setMsg("✅ Password reset successfully!");

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Something went wrong"));
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
            <span style={{ color: "var(--accent-green)" }}>RESET</span> PASSWORD
          </h2>
          <p className="text-muted fw-semibold">Enter your new credentials</p>
        </div>

        {/* Display message */}
        {msg && (
          <div
            className={`alert animate-fade-up py-3 mb-4`}
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

        {/* New Password Field */}
        <div className="mb-3 animate-fade-up delay-1">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">New Password</label>
          <div className="input-group position-relative">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              className="form-control border-start-0"
              placeholder="New Password"
              value={data.newPassword}
              onChange={e => setData({ ...data, newPassword: e.target.value })}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white", paddingRight: "40px" }}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "var(--text-muted)",
                zIndex: 10
              }}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <i className={showNewPassword ? "fa fa-eye text-white" : "fa fa-eye-slash"}></i>
            </span>
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
          </small>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4 animate-fade-up delay-2">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Confirm New Password</label>
          <div className="input-group position-relative">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-lock text-white"></i>
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control border-start-0"
              placeholder="Confirm New Password"
              value={data.confirmPassword}
              onChange={e => setData({ ...data, confirmPassword: e.target.value })}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white", paddingRight: "40px" }}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "var(--text-muted)",
                zIndex: 10
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={showConfirmPassword ? "fa fa-eye text-white" : "fa fa-eye-slash"}></i>
            </span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          className="btn-health w-100 py-3 fs-5 mt-2 animate-fade-up delay-3"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
