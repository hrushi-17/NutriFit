import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/pages/Auth.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [data, setData] = useState({ newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async () => {
    if (!passwordRegex.test(data.newPassword)) {
      setMsg("Password does not meet the required criteria.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      setMsg("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="auth-background animate-fade-up">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>

        {msg && (
          <div className="alert mb-4" style={{ background: "#e87c03", color: "white", border: "none", borderRadius: "4px", padding: "10px 20px" }}>
            {msg}
          </div>
        )}

        <div className="auth-input-group animate-fade-up delay-1">
          <input
            type="password"
            className="netflix-input"
            placeholder="New Password"
            value={data.newPassword}
            onChange={e => setData({ ...data, newPassword: e.target.value })}
          />
          <small style={{ color: "#737373", fontSize: "0.75rem", display: "block", marginTop: "8px" }}>
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
          </small>
        </div>

        <div className="auth-input-group animate-fade-up delay-2 mt-4">
          <input
            type="password"
            className="netflix-input"
            placeholder="Confirm New Password"
            value={data.confirmPassword}
            onChange={e => setData({ ...data, confirmPassword: e.target.value })}
          />
        </div>

        <button
          className="btn-netflix w-100 py-3 fs-5 mt-4 animate-fade-up delay-3"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
