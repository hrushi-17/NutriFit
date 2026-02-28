import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/pages/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const tabs = [
    { path: "bmi", label: "BMI", icon: "fa-weight-scale" },
    { path: "health", label: "Health", icon: "fa-heart-pulse" },
    { path: "workout", label: "Workout", icon: "fa-dumbbell" },
    { path: "diet", label: "Diet", icon: "fa-utensils" },
    { path: "goals", label: "Goals", icon: "fa-bullseye" },
    { path: "progress", label: "Progress", icon: "fa-chart-line" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>

      {/* ─── HERO HEADER ─── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(229,9,20,0.10) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(229,9,20,0.25)",
        padding: "32px 24px 0"
      }}>
        <p style={{ color: "#a3a3a3", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
          Welcome back
        </p>
        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "4px", textTransform: "uppercase", margin: "6px 0 28px" }}>
          NUTRI<span style={{ color: "#e50914" }}>FIT</span> <span style={{ color: "#a3a3a3", fontWeight: 400 }}>DASHBOARD</span>
        </h1>

        {/* ─── NAV TABS ─── */}
        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          {tabs.map(tab => {
            const isActive = location.pathname.includes(`/dashboard/${tab.path}`);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "6px 6px 0 0",
                  transition: "background 0.2s, color 0.2s",
                  background: isActive ? "#e50914" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#fff" : "#a3a3a3",
                  borderTop: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderLeft: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRight: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderBottom: isActive ? "3px solid #e50914" : "3px solid transparent",
                }}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── PAGE CONTENT ─── */}
      <div className="py-4 px-3">
        <Outlet />
      </div>
    </div>
  );
}