import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/pages/Dashboard.css"; // Ensure Dashboard.css is loaded

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="container mt-4 animate-fade-down">

      {/* ===== Header Card ===== */}
      <div className="glass-panel shadow-lg border-0 mb-4 p-4 text-center neon-blue animate-fade-up delay-1">
        <h2 className="fw-bold mb-2 text-uppercase letter-spacing-2" style={{ color: "#fff", textShadow: "0 2px 10px rgba(0,136,255,0.4)" }}>
          <i className="fa-solid fa-bolt text-primary me-2"></i> NUTRI<span style={{ color: "var(--accent-red)" }}>FIT</span> DASHBOARD
        </h2>
        <p className="mb-0 text-muted fs-5">
          Your Personal Command Center
        </p>
      </div>

      {/* ===== Navigation Tabs ===== */}
      <div className="glass-panel shadow-lg border-0 mb-4 p-3 animate-fade-up delay-2">
        <div className="d-flex justify-content-center flex-wrap gap-3">

          <Link to="bmi" className={`btn ${location.pathname.includes("/dashboard/bmi") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-weight-scale me-2"></i> BMI
          </Link>

          <Link to="health" className={`btn ${location.pathname.includes("/dashboard/health") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-heart-pulse me-2"></i> Health
          </Link>

          <Link to="workout" className={`btn ${location.pathname.includes("/dashboard/workout") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-dumbbell me-2"></i> Workout
          </Link>

          <Link to="diet" className={`btn ${location.pathname.includes("/dashboard/diet") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-utensils me-2"></i> Diet
          </Link>

          <Link to="goals" className={`btn ${location.pathname.includes("/dashboard/goals") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-bullseye me-2"></i> Goals
          </Link>

          <Link to="progress" className={`btn ${location.pathname.includes("/dashboard/progress") ? "btn-hero-primary shadow-lg" : "btn-outline-glass"} fw-semibold px-4 py-2 text-uppercase letter-spacing-1`}>
            <i className="fa-solid fa-chart-line me-2"></i> Progress
          </Link>

        </div>
      </div>

      {/* ===== Module Content Area ===== */}
      <div className="shadow-lg animate-fade-up delay-3">
        <Outlet />
      </div>

    </div>
  );
}