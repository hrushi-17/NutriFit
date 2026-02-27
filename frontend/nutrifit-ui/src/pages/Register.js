import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate-fade-up"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="premium-card p-4 p-md-5 w-100 mx-3 text-center"
        style={{
          maxWidth: "450px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}
      >
        <div className="mb-4">
          <h2 className="fw-bolder text-white" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "var(--accent-red)" }}>JOIN</span> US
          </h2>
          <p className="text-muted fw-semibold">Choose your account type</p>
        </div>

        <button
          className="btn-health w-100 mb-3 py-3 fs-5 animate-fade-up delay-1 d-flex justify-content-center align-items-center"
          onClick={() => navigate("/register-user")}
        >
          <i className="fa-solid fa-user me-2"></i> User Registration
        </button>

        <button
          className="btn-outline-glass w-100 py-3 fs-5 animate-fade-up delay-2 d-flex justify-content-center align-items-center"
          onClick={() => navigate("/register-admin")}
        >
          <i className="fa-solid fa-shield-halved me-2 text-warning"></i> Admin Registration
        </button>

        <p className="text-center mt-5 mb-0 animate-fade-up delay-3" style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <span
            className="fw-bold"
            style={{ color: "white", cursor: "pointer", transition: "0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent-red)"}
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
