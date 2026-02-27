import api from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
            <span style={{ color: "var(--accent-red)" }}>NUTRI</span>FIT
          </h2>
          <p className="text-muted fw-semibold">Sign In to Your Account</p>
        </div>

        {/* Error Message */}
        {msg && (
          <div className="alert animate-fade-up" style={{ background: "rgba(229, 9, 20, 0.1)", color: "var(--accent-red)", border: "1px solid var(--accent-red)", fontSize: "0.9rem" }}>
            <i className="fa-solid fa-circle-exclamation me-2"></i> {msg}
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
              onChange={e => setData({ ...data, email: e.target.value })}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-3 animate-fade-up delay-2">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Password</label>
          <div className="input-group position-relative">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password"
              onChange={e => setData({ ...data, password: e.target.value })}
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
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "fa fa-eye text-white" : "fa fa-eye-slash"}></i>
            </span>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-end mb-4 animate-fade-up delay-2">
          <Link to="/forgot-password" style={{ fontSize: "0.85rem", textDecoration: "none", color: "var(--text-muted)", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          className="btn-netflix w-100 py-3 fs-5 mt-2 animate-fade-up delay-3"
          onClick={login}
        >
          Sign In
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 mb-0 animate-fade-up delay-4" style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          New to NutriFit?{" "}
          <Link to="/register" className="fw-bold" style={{ color: "white", textDecoration: "none", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent-red)"} onMouseLeave={e => e.currentTarget.style.color = "white"}>
            Sign up now.
          </Link>
        </p>
      </div>
    </div>
  );
}
