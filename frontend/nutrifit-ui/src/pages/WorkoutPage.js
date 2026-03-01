import api from "../api/axios";
import { useEffect, useState } from "react";

export default function WorkoutPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/workout/weekly-plan")
      .then(res => { setList(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getIntensityMeta = (intensity) => {
    const i = intensity?.toLowerCase();
    if (i === "low") return { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "LOW" };
    if (i === "moderate") return { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "MODERATE" };
    return { color: "#e50914", bg: "rgba(229,9,20,0.12)", label: "HIGH" };
  };

  if (loading) return (
    <div className="text-center fw-bold mt-5 text-light">
      <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading your workout plan...
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {/* ─── SECTION HEADER ─── */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ color: "#a3a3a3", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
          Personalized Plan
        </p>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "2px", textTransform: "uppercase", margin: "4px 0 0" }}>
          Weekly <span style={{ color: "#e50914" }}>Workout</span> Plan
        </h2>
        <div style={{ width: "48px", height: "3px", background: "#e50914", marginTop: "10px", borderRadius: "2px" }}></div>
      </div>

      {list.length === 0 && (
        <div style={{ background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: "8px", padding: "20px", textAlign: "center", color: "#e5e5e5" }}>
          <i className="fa-solid fa-circle-info me-2"></i>
          No workout plan found. Please complete your profile and health conditions.
        </div>
      )}

      {/* ─── WORKOUT CARDS ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {list.map((w, i) => {
          const meta = getIntensityMeta(w.intensity);
          return (
            <div key={i} style={{
              background: "rgba(18,18,18,0.95)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: "4px solid #e50914",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {/* Card Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                background: "rgba(0,0,0,0.4)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px",
                    background: meta.bg,
                    border: `1px solid ${meta.color}40`,
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: meta.color, fontWeight: 800, fontSize: "0.75rem",
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
                      {w.dayName}
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
                      {w.workoutName}
                    </div>
                  </div>
                </div>
                <span style={{
                  background: meta.bg,
                  color: meta.color,
                  border: `1px solid ${meta.color}50`,
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}>
                  {meta.label}
                </span>
              </div>

              {/* Card Body – Stats Grid */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "14px" }}>
                  {[
                    { label: "Type", value: w.workoutType },
                    { label: "Duration", value: `${w.durationMinutes} min` },
                    { label: "Level", value: w.intensity },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "8px",
                      padding: "12px",
                      textAlign: "center",
                    }}>
                      <div style={{ color: "#606060", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                        {stat.label}
                      </div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Health Note */}
                <div style={{
                  background: "rgba(245,158,11,0.07)",
                  border: "1px solid rgba(245,158,11,0.18)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  color: "#d4a01a",
                  fontSize: "0.8rem",
                }}>
                  <i className="fa-solid fa-shield-halved me-2"></i>
                  {w.healthSafe}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}