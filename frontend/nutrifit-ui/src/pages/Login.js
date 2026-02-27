import api from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
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
    <div className="auth-background animate-fade-up">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>

        {/* Error Message */}
        {msg && (
          <div className="alert mb-4" style={{ background: "#e87c03", color: "white", border: "none", borderRadius: "4px", padding: "10px 20px" }}>
            {msg}
          </div>
        )}

        {/* Email Field */}
        <div className="auth-input-group animate-fade-up delay-1">
          <input
            type="email"
            className="netflix-input"
            placeholder="Email Address"
            onChange={e => setData({ ...data, email: e.target.value })}
          />
        </div>

        {/* Password Field */}
        <div className="auth-input-group animate-fade-up delay-2">
          <input
            type="password"
            className="netflix-input"
            placeholder="Password"
            onChange={e => setData({ ...data, password: e.target.value })}
          />
        </div>

        {/* Login Button */}
        <button
          className="btn-netflix w-100 mt-4 animate-fade-up delay-3"
          style={{ padding: "16px", fontSize: "1.1rem" }}
          onClick={login}
        >
          Sign In
        </button>

        {/* Footer Links */}
        <div className="d-flex justify-content-between mt-3 animate-fade-up delay-3 text-muted" style={{ fontSize: "0.85rem" }}>
          <div>
            <input type="checkbox" id="rememberMe" className="me-2" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" style={{ textDecoration: "none", color: "#b3b3b3" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Need help?
          </Link>
        </div>

        <div className="auth-footer-text animate-fade-up delay-4 mt-5">
          New to NutriFit? <Link to="/register" className="auth-footer-link">Sign up now.</Link>
        </div>
      </div>
    </div>
  );
}
