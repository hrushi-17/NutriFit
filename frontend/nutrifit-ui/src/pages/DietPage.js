import api from "../api/axios";
import { useEffect, useState } from "react";

export default function DietPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const mealOrder = { breakfast: 1, snack: 2, lunch: 3, snack2: 4, dinner: 5 };

  const mealMeta = {
    breakfast: { icon: "fa-sun", color: "#e50914", label: "Breakfast" },
    snack: { icon: "fa-apple-whole", color: "#e50914", label: "Snack" },
    lunch: { icon: "fa-utensils", color: "#e50914", label: "Lunch" },
    snack2: { icon: "fa-cookie", color: "#e50914", label: "Snack 2" },
    dinner: { icon: "fa-moon", color: "#e50914", label: "Dinner" },
  };

  useEffect(() => {
    api.get("/diet/daily-plan")
      .then(res => { setList(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center fw-bold mt-5 text-light">
      <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading your diet plan...
    </div>
  );

  const sorted = [...list].sort((a, b) => mealOrder[a.mealType] - mealOrder[b.mealType]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {/* ─── SECTION HEADER ─── */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ color: "#a3a3a3", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
          Daily Nutrition
        </p>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "2px", textTransform: "uppercase", margin: "4px 0 0" }}>
          Your <span style={{ color: "#e50914" }}>Diet</span> Plan
        </h2>
        <div style={{ width: "48px", height: "3px", background: "#e50914", marginTop: "10px", borderRadius: "2px" }}></div>
      </div>

      {list.length === 0 && (
        <div style={{ background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: "8px", padding: "20px", textAlign: "center", color: "#e5e5e5" }}>
          <i className="fa-solid fa-circle-info me-2"></i>
          No diet plan found. Please complete your profile and health conditions.
        </div>
      )}

      {/* ─── MEAL CARDS ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sorted.map((d, i) => {
          const meta = mealMeta[d.mealType] || { icon: "fa-bowl-food", color: "#e5e5e5", label: d.mealType };
          return (
            <div key={i} style={{
              background: "rgba(18,18,18,0.95)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: `4px solid ${meta.color}`,
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
                    width: "38px", height: "38px",
                    background: `${meta.color}18`,
                    border: `1px solid ${meta.color}40`,
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: meta.color, fontSize: "1rem",
                  }}>
                    <i className={`fa-solid ${meta.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ color: "#a3a3a3", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
                      {meta.label}
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
                      {d.foodName}
                    </div>
                  </div>
                </div>
                <span style={{
                  background: `${meta.color}15`,
                  color: meta.color,
                  border: `1px solid ${meta.color}40`,
                  borderRadius: "4px",
                  padding: "5px 14px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}>
                  {d.calories} kcal
                </span>
              </div>

              {/* Card Body – Macro Grid */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "14px" }}>
                  {[
                    { label: "Protein", value: `${d.protein} g`, color: "#60a5fa" },
                    { label: "Carbs", value: `${d.carbs} g`, color: "#f59e0b" },
                    { label: "Fat", value: `${d.fat} g`, color: "#f87171" },
                    { label: "Sodium", value: `${d.sodiumContent} mg`, color: "#a78bfa" },
                  ].map(macro => (
                    <div key={macro.label} style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "8px",
                      padding: "10px 8px",
                      textAlign: "center",
                    }}>
                      <div style={{ color: "#555", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                        {macro.label}
                      </div>
                      <div style={{ color: macro.color, fontWeight: 800, fontSize: "0.95rem" }}>
                        {macro.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* GI Note */}
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  padding: "9px 14px",
                  color: "#a3a3a3",
                  fontSize: "0.78rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <i className="fa-solid fa-droplet" style={{ color: "#60a5fa" }}></i>
                  <span><strong style={{ color: "#e5e5e5" }}>Glycemic Index:</strong> {d.glycemicIndex}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}