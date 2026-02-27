import api from "../api/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function RegisterUser() {
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const register = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (!passwordRegex.test(data.password)) {
      alert("Password does not meet the required criteria.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.post("/auth/register-user", data);
      alert("Account created successfully. Please sign in.");
      navigate("/login");
    } catch (e) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-background animate-fade-up">
      <div className="auth-overlay"></div>

      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">Create User Account</h1>

        <div className="auth-grid">
          {/* Name Field */}
          <div className="auth-input-group animate-fade-up delay-1">
            <label className="auth-label">Full Name</label>
            <input
              className="netflix-input"
              placeholder="Name"
              onChange={e => setData({ ...data, name: e.target.value })}
            />
          </div>

          {/* Email Field */}
          <div className="auth-input-group animate-fade-up delay-1">
            <label className="auth-label">Email Address</label>
            <input
              className="netflix-input"
              placeholder="Email"
              type="email"
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="auth-input-group animate-fade-up delay-2">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="netflix-input"
              placeholder="Password"
              onChange={e => setData({ ...data, password: e.target.value })}
            />
            <small style={{ color: "#737373", fontSize: "0.75rem", display: "block", marginTop: "8px" }}>
              Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
            </small>
          </div>

          {/* Confirm Password Field */}
          <div className="auth-input-group animate-fade-up delay-2">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              className="netflix-input"
              placeholder="Confirm password"
              onChange={e => setData({ ...data, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <button
          className="btn-netflix w-100 py-3 fs-5 mt-4 animate-fade-up delay-3"
          onClick={register}
        >
          Agree & Join
        </button>

        <div className="auth-footer-text text-center animate-fade-up delay-4 mt-5">
          Already have an account? <Link to="/login" className="auth-footer-link">Sign in here.</Link>
        </div>
      </div>
    </div>
  );
}
