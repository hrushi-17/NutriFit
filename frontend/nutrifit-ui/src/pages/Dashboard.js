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
      <div className="premium-card mb-4" style={{ background: "linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(16, 185, 129, 0.05))", border: "1px solid rgba(229, 9, 20, 0.2)" }}>
        <div className="card-body text-center">
          <h2 className="fw-bold mb-2 text-white" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "var(--accent-red)" }}>NUTRI</span>FIT <span className="fs-5 text-muted fw-normal">| USER DASHBOARD</span>
          </h2>
          <p className="mb-0 text-muted">
            Track your metrics, achieve your goals, and unlock your potential.
          </p>
        </div>
      </div>

      {/* ===== Sleek Navigation Pills ===== */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-4 animate-fade-up delay-1">

        <Link
          to="bmi"
          className={`btn ${location.pathname.includes("/dashboard/bmi") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-weight-scale me-2"></i> BMI
        </Link>

        <Link
          to="health"
          className={`btn ${location.pathname.includes("/dashboard/health") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-heart-pulse me-2"></i> Health
        </Link>

        <Link
          to="workout"
          className={`btn ${location.pathname.includes("/dashboard/workout") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-dumbbell me-2"></i> Workout
        </Link>

        <Link
          to="diet"
          className={`btn ${location.pathname.includes("/dashboard/diet") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-utensils me-2"></i> Diet
        </Link>

        <Link
          to="goals"
          className={`btn ${location.pathname.includes("/dashboard/goals") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-bullseye me-2"></i> Goals
        </Link>

        <Link
          to="progress"
          className={`btn ${location.pathname.includes("/dashboard/progress") ? "btn-outline-glass active-red" : "btn-outline-glass"} px-4 py-2`}
        >
          <i className="fa-solid fa-chart-line me-2"></i> Progress
        </Link>

      </div>

      {/* ===== Module Content Area ===== */}
      <div className="animate-fade-up delay-2">
        <Outlet />
      </div>

    </div>
  );
}