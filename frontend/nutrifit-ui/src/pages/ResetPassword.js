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
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg" style={{ maxWidth: "800px" }}>

        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title"><i className="fa-solid fa-key text-danger me-2"></i><br />RESET</h1>
          <p className="auth-graphic-subtitle mt-3">Create your new secure password.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <h3 className="auth-title mb-4">Reset Password</h3>

          {/* Display message */}
          {msg && (
            <div
              className={`alert ${msg.startsWith("✅") ? "alert-success border-0 bg-success text-white" : "alert-danger border-0 bg-danger text-white"} py-2 mb-3 rounded`}
              style={{ fontSize: "0.9rem" }}
            >
              {msg}
            </div>
          )}

          {/* New Password Field */}
          <div className="auth-input-group animate-fade-up delay-1">
            <label className="auth-label text-light fw-semibold">New Password</label>
            <div className="position-relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control netflix-input"
                placeholder="New Password"
                value={data.newPassword}
                onChange={e => setData({ ...data, newPassword: e.target.value })}
              />
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#b3b3b3"
                }}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="auth-input-group animate-fade-up delay-2 mt-3">
            <label className="auth-label text-light fw-semibold">Confirm Password</label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control netflix-input"
                placeholder="Confirm New Password"
                value={data.confirmPassword}
                onChange={e => setData({ ...data, confirmPassword: e.target.value })}
              />
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#b3b3b3"
                }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
              </span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="btn btn-netflix w-100 mt-4 animate-fade-up delay-3 fw-bold"
            style={{ padding: "14px", fontSize: "1.05rem" }}
            onClick={handleSubmit}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
