import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "", secretKey: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Password validation regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const register = async () => {
    // ✅ Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("❌ Please enter a valid email address!");
      return;
    }

    // ✅ Password strength validation
    if (!passwordRegex.test(data.password)) {
      alert("❌ Password does not meet the required criteria. Please check the requirements below the password field.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("❌ Password and Confirm Password do not match!");
      return;
    }

    await api.post("/auth/register-admin", data);
    alert("Admin registered successfully. Please login.");
    navigate("/login");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate-fade-up"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="premium-card p-4 p-md-5 w-100 mx-3"
        style={{
          maxWidth: "500px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bolder text-white" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "var(--accent-warning)" }}>ADMIN</span> SIGNUP
          </h2>
          <p className="text-muted fw-semibold">Create a privileged account</p>
        </div>

        {/* Name Field */}
        <div className="mb-3 animate-fade-up delay-1">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Full Name</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-regular fa-user"></i>
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Enter your full name"
              onChange={e => setData({ ...data, name: e.target.value })}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-3 animate-fade-up delay-1">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Email Address</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-regular fa-envelope"></i>
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Enter your email"
              type="email"
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
          <small className="text-muted" style={{ fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
          </small>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-3 animate-fade-up delay-2">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Confirm Password</label>
          <div className="input-group position-relative">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control"
              placeholder="Confirm password"
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
              onClick={() => setShowConfirm(!showConfirm)}
            >
              <i className={showConfirm ? "fa fa-eye text-white" : "fa fa-eye-slash"}></i>
            </span>
          </div>
        </div>

        {/* Secret Key Field */}
        <div className="mb-4 animate-fade-up delay-3">
          <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-2">Admin Secret Key</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
              <i className="fa-solid fa-key text-warning"></i>
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Enter admin secret key"
              type="password"
              onChange={e => setData({ ...data, secretKey: e.target.value })}
              style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
            />
          </div>
        </div>

        <button
          className="btn-outline-glass w-100 py-3 fs-5 mt-2 animate-fade-up delay-4"
          style={{ borderColor: "var(--accent-warning)", color: "var(--accent-warning)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-warning)"; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-warning)"; }}
          onClick={register}
        >
          Create Admin Account
        </button>

        <p className="text-center mt-4 mb-0 animate-fade-up delay-4" style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <span
            className="fw-bold"
            style={{ color: "white", cursor: "pointer", transition: "0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent-warning)"}
            onMouseLeave={e => e.currentTarget.style.color = "white"}
            onClick={() => navigate("/login")}
          >
            Sign in here.
          </span>
        </p>
      </div>
    </div>
  );
}
