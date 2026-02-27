import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="container mt-4 animate-fade-up">

      {/* ===== Premium Header Card ===== */}
      <div className="premium-card mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
        <div className="card-body text-center py-4">
          <h2 className="fw-bolder mb-2 text-white" style={{ letterSpacing: "2px" }}>
            <span style={{ color: "var(--accent-red)" }}>USER</span> DASHBOARD
          </h2>
          <p className="mb-0 text-muted" style={{ letterSpacing: "1px", fontSize: "0.9rem", textTransform: "uppercase" }}>
            Track your metrics, achieve your goals, and unlock your potential.
          </p>
        </div>
      </div>

      {/* ===== Sleek Navigation Pills ===== */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-4 animate-fade-up delay-1">

        <Link
          to="bmi"
          className={`btn ${location.pathname.includes("/dashboard/bmi") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          BMI
        </Link>

        <Link
          to="health"
          className={`btn ${location.pathname.includes("/dashboard/health") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          Health
        </Link>

        <Link
          to="workout"
          className={`btn ${location.pathname.includes("/dashboard/workout") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          Workout
        </Link>

        <Link
          to="diet"
          className={`btn ${location.pathname.includes("/dashboard/diet") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          Diet
        </Link>

        <Link
          to="goals"
          className={`btn ${location.pathname.includes("/dashboard/goals") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          Goals
        </Link>

        <Link
          to="progress"
          className={`btn ${location.pathname.includes("/dashboard/progress") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2 fw-bold text-uppercase`}
          style={{ letterSpacing: "1px" }}
        >
          Progress
        </Link>

      </div>

      {/* ===== Module Content Area ===== */}
      <div className="animate-fade-up delay-2">
        <Outlet />
      </div>

    </div>
  );
}