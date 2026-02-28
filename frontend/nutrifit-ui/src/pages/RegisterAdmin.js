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
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg" style={{ maxWidth: "1000px" }}>
        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title"><i className="fa-solid fa-user-shield text-danger me-2"></i><br />ADMIN ACCESS</h1>
          <p className="auth-graphic-subtitle mt-3">Manage the NutriFit platform.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <h3 className="auth-title mb-4 text-center">Admin Registration</h3>

          <div className="row g-3">
            {/* Name Field */}
            <div className="col-md-6">
              <label className="auth-label text-light fw-semibold">Full Name</label>
              <div className="auth-input-group">
                <input
                  className="form-control netflix-input"
                  placeholder="Enter name"
                  onChange={e => setData({ ...data, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="col-md-6">
              <label className="auth-label text-light fw-semibold">Email</label>
              <div className="auth-input-group">
                <input
                  className="form-control netflix-input"
                  placeholder="Enter email"
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

            {/* Secret Key Field */}
            <div className="col-12">
              <label className="auth-label text-light fw-semibold">Admin Secret Key</label>
              <div className="auth-input-group">
                <input
                  className="form-control netflix-input"
                  placeholder="Enter admin secret key"
                  onChange={e => setData({ ...data, secretKey: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            className="btn btn-netflix w-100 mt-4 py-3 fw-bold fs-5"
            onClick={register}
          >
            Create Admin Account
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
