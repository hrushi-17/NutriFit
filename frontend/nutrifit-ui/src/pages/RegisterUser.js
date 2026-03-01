import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const register = async () => {
    // ✅ Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setMsg("Please enter a valid email address!");
      return;
    }

    // ✅ Password strength validation
    if (!passwordRegex.test(data.password)) {
      setMsg("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register-user", data);
      setMsg("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg" style={{ maxWidth: "900px" }}>
        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title"><i className="fa-solid fa-user-plus text-danger me-2"></i><br />JOIN US</h1>
          <p className="auth-graphic-subtitle mt-3">Start your fitness journey today.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <h3 className="auth-title mb-4">User Registration</h3>

          {/* Message Display */}
          {msg && (
            <div className={`auth-alert ${msg.startsWith("✅") ? "auth-alert-success" : "auth-alert-error"}`}>
              <i className={`fa-solid ${msg.startsWith("✅") ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
              {msg}
            </div>
          )}

          <div className="row g-3">
            {/* Name Field */}
            <div className="col-12">
              <label className="auth-label text-light fw-semibold">Full Name</label>
              <div className="auth-input-group">
                <input
                  className="form-control netflix-input"
                  placeholder="Enter your full name"
                  onChange={e => setData({ ...data, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="col-12">
              <label className="auth-label text-light fw-semibold">Email</label>
              <div className="auth-input-group">
                <input
                  className="form-control netflix-input"
                  placeholder="Enter your email"
                  type="email"
                  onChange={e => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="col-md-6">
              <label className="auth-label text-light fw-semibold">Password</label>
              <div className="auth-input-group position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control netflix-input"
                  placeholder="Password"
                  onChange={e => setData({ ...data, password: e.target.value })}
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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="col-md-6">
              <label className="auth-label text-light fw-semibold">Confirm Password</label>
              <div className="auth-input-group position-relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control netflix-input"
                  placeholder="Confirm"
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
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <i className={showConfirm ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-netflix w-100 mt-4 py-3 fw-bold fs-5"
            onClick={register}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
            ) : "Register Now"}
          </button>

          <p className="auth-footer-text text-center mt-4">
            Already have an account? <span
              className="auth-footer-link"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
