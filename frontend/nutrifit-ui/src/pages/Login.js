import api from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/Auth.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/profile");
    } catch (e) {
      if (e.response?.status === 404) setMsg("User not found.");
      else if (e.response?.status === 401) setMsg("Invalid password.");
      else setMsg("Login failed.");
    }
  };

  return (
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg">
        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title">NUTRI<span style={{ color: "var(--accent-red)" }}>FIT</span></h1>
          <p className="auth-graphic-subtitle">Sign in to continue your journey.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <h3 className="auth-title">Sign In</h3>

          {/* Error Message */}
          {msg && (
            <div className="auth-alert auth-alert-error">
              <i className="fa-solid fa-circle-exclamation"></i>
              {msg}
            </div>
          )}

          {/* Email Field */}
          <label className="form-label text-light fw-semibold">Email</label>
          <div className="auth-input-group animate-fade-up delay-1">
            <input
              type="email"
              className="form-control netflix-input"
              placeholder="Enter your email"
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="d-flex justify-content-between align-items-end mb-1">
            <label className="form-label text-light fw-semibold mb-0">Password</label>
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "#b3b3b3", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "#b3b3b3"}>
              Forgot Password?
            </Link>
          </div>
          <div className="auth-input-group animate-fade-up delay-2 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control netflix-input"
              placeholder="Enter password"
              style={{ paddingRight: "40px" }}
              onChange={e => setData({ ...data, password: e.target.value })}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
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

          {/* Login Button */}
          <button
            className="btn btn-netflix w-100 mt-4 animate-fade-up delay-3"
            style={{ padding: "14px", fontSize: "1.05rem" }}
            onClick={login}
          >
            Sign In
          </button>

          {/* Footer */}
          <div className="auth-footer-text animate-fade-up delay-4 mt-4 text-center">
            New to NutriFit? <Link to="/register" className="auth-footer-link">Sign up now.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
