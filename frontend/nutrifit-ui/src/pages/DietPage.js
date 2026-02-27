import api from "../api/axios";
import { useEffect, useState } from "react";

export default function DietPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/diet/daily-plan")
      .then(res => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mealOrder = {
    breakfast: 1,
    snack: 2,
    lunch: 3,
    snack2: 4,
    dinner: 5
  };

  if (loading) {
    return (
      <div className="text-center fw-bold mt-4">
        ⏳ Loading your diet plan...
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-3 animate-fade-up">
      <div className="col-md-10">

        <div className="premium-card mb-4" style={{ background: "var(--bg-card)" }}>
          <div className="card-header border-0 pb-0" style={{ background: "transparent" }}>
            <h4 className="fw-bold text-center mb-0 text-white" style={{ letterSpacing: "1px" }}>
              🥗 Your Daily Diet Plan
            </h4>
          </div>

          <div className="card-body">

            {list.length === 0 && (
              <div className="animate-fade-up delay-1 mb-4" style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid var(--accent-blue)",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                color: "var(--accent-blue)",
                fontWeight: "600"
              }}>
                <i className="fa-solid fa-circle-info me-2"></i> No diet plan matched your profile yet. Please update your profile and health conditions.
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              {[...list]
                .sort((a, b) => mealOrder[a.mealType] - mealOrder[b.mealType])
                .map((d, i) => {
                  const delayClass = `delay-${Math.min((i % 5) + 1, 5)}`;

                  return (
                    <div key={i} className={`animate-fade-up ${delayClass}`}>
                      <div
                        className="p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--border-light)",
                          borderLeft: "4px solid var(--accent-green)",
                          borderRadius: "12px",
                          transition: "transform 0.2s, background 0.2s",
                          cursor: "default"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(5px)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="fw-bold text-capitalize mb-0 text-white" style={{ letterSpacing: '0.5px' }}>
                            <i className="fa-solid fa-utensils me-2" style={{ color: "var(--accent-green)" }}></i> {d.mealType}
                          </h5>
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "var(--accent-green)",
                              border: "1px solid var(--accent-green)",
                              fontWeight: '600',
                              letterSpacing: '1px'
                            }}
                          >
                            {d.calories} KCAL
                          </span>
                        </div>

                        <h5 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>{d.foodName}</h5>

                        <div className="row mt-2 text-muted fw-semibold small g-2 text-center">
                          <div className="col-3">
                            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div style={{ color: "var(--accent-blue)" }}>🥩 PROTEIN</div>
                              <div className="text-white mt-1 fs-6">{d.protein}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div style={{ color: "var(--accent-warning)" }}>🍚 CARBS</div>
                              <div className="text-white mt-1 fs-6">{d.carbs}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div style={{ color: "var(--accent-red)" }}>🥑 FAT</div>
                              <div className="text-white mt-1 fs-6">{d.fat}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div style={{ color: "var(--text-muted)" }}>🧂 SODIUM</div>
                              <div className="text-white mt-1 fs-6">{d.sodiumContent}mg</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-end small">
                          <span className="badge bg-secondary opacity-75 rounded-pill px-3 py-1 fw-normal">
                            Glycemic Index: {d.glycemicIndex}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}