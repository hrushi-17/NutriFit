import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/pages/Dashboard.css";
import Footer from "../components/Footer";

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
        padding: "36px 0 0",
        textAlign: "center",
      }}>
        <p style={{
          color: "#a3a3a3",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "4px",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}>
          Welcome back
        </p>
        <h1 style={{
          color: "#fff",
          fontWeight: 900,
          fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
          letterSpacing: "5px",
          textTransform: "uppercase",
          margin: "0 0 32px",
        }}>
          NUTRI<span style={{ color: "#e50914" }}>FIT</span>{" "}
          <span style={{ color: "#a3a3a3", fontWeight: 300, fontSize: "0.85em" }}>DASHBOARD</span>
        </h1>

        {/* ─── NAV TABS (centered) ─── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "6px",
          paddingBottom: "0",
        }}>
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
                  padding: "12px 26px",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "6px 6px 0 0",
                  transition: "all 0.2s",
                  background: isActive
                    ? "#e50914"
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? "#fff" : "#808080",
                  border: "1px solid",
                  borderColor: isActive
                    ? "#e50914"
                    : "rgba(255,255,255,0.07)",
                  borderBottom: isActive
                    ? "3px solid #e50914"
                    : "3px solid transparent",
                  boxShadow: isActive
                    ? "0 -2px 20px rgba(229,9,20,0.25)"
                    : "none",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#808080";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }
                }}
              >
                <i className={`fa-solid ${tab.icon}`} style={{ fontSize: "0.85rem" }}></i>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── PAGE CONTENT ─── */}
      <div style={{ padding: "28px 20px" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}