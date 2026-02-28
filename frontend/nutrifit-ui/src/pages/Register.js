import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/Auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-background animate-fade-up">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h1 className="auth-title">Join NutriFit</h1>
        <p className="auth-label mb-4">Choose your account type to get started.</p>

        <button
          className="btn-netflix w-100 mb-3 animate-fade-up delay-1"
          style={{ padding: "16px", fontSize: "1.1rem" }}
          onClick={() => navigate("/register-user")}
        >
          USER ACCOUNT
        </button>

        <button
          className="btn-outline-glass w-100 animate-fade-up delay-2"
          style={{ padding: "16px", fontSize: "1.1rem" }}
          onClick={() => navigate("/register-admin")}
        >
          ADMIN ACCOUNT
        </button>

        <div className="auth-footer-text animate-fade-up delay-3 mt-5">
          Already have an account? <Link to="/login" className="auth-footer-link">Sign in.</Link>
        </div>
      </div>
    </div>
  );
}
