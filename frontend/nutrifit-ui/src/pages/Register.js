import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/Auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-background animate-fade-down">
      <div className="auth-overlay"></div>

      <div className="auth-horizontal-card shadow-lg" style={{ maxWidth: "800px" }}>

        {/* Left Graphic Side */}
        <div className="auth-graphic-side">
          <h1 className="auth-graphic-title">NUTRI<span style={{ color: "var(--accent-red)" }}>FIT</span></h1>
          <p className="auth-graphic-subtitle">Join us and transform your life today.</p>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side d-flex flex-column justify-content-center">
          <h3 className="auth-title mb-4 text-center">Select Account Type</h3>

          <button
            className="btn btn-netflix w-100 mb-3 py-3 fs-5 fw-bold"
            onClick={() => navigate("/register-user")}
          >
            <i className="fa-solid fa-user me-2"></i> User Registration
          </button>

          <button
            className="btn btn-outline-glass w-100 py-3 fs-5 fw-bold"
            onClick={() => navigate("/register-admin")}
          >
            <i className="fa-solid fa-user-shield me-2"></i> Admin Registration
          </button>

          <div className="auth-footer-text mt-4 text-center">
            Already have an account? <Link to="/login" className="auth-footer-link">Sign in now.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
