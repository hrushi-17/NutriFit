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
      <div className="text-center fw-bold mt-4 text-muted text-uppercase" style={{ letterSpacing: "1px" }}>
        Loading Diet Plan...
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-3 animate-fade-up">
      <div className="col-md-10">

        <div className="netflix-card p-4 mb-4">
          <div className="text-center mb-4">
            <h4 className="fw-bolder mb-0 text-white" style={{ letterSpacing: "2px" }}>
              NUTRITION PROTOCOL
            </h4>
          </div>

          <div className="card-body p-0">

            {list.length === 0 && (
              <div className="animate-fade-up delay-1 mb-4" style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid var(--accent-blue)",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                color: "var(--accent-blue)",
                fontWeight: "600"
              }}>
                No diet plan matched your profile yet. Please update your profile and health conditions.
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
                          background: "var(--bg-card-hover)",
                          border: "1px solid var(--border-light)",
                          borderLeft: "4px solid var(--accent-green)",
                          borderRadius: "8px",
                          transition: "all 0.2s ease-in-out",
                          cursor: "default"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(5px)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.background = "var(--bg-card-hover)";
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                          <h5 className="fw-bolder text-uppercase mb-0 text-white" style={{ letterSpacing: '1px' }}>
                            {d.mealType}
                          </h5>
                          <div
                            className="fw-bold"
                            style={{
                              color: "var(--accent-green)",
                              letterSpacing: '1px'
                            }}
                          >
                            {d.calories} KCAL
                          </div>
                        </div>

                        <h5 className="fw-bold mb-3 text-white">{d.foodName}</h5>

                        <div className="row mt-2 text-muted fw-semibold small g-2 text-center">
                          <div className="col-3">
                            <div className="p-2 rounded border border-secondary" style={{ background: "rgba(0,0,0,0.3)" }}>
                              <div className="text-uppercase" style={{ color: "var(--accent-blue)", fontSize: "0.7rem", letterSpacing: "1px" }}>Protein</div>
                              <div className="text-white mt-1 fs-6">{d.protein}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded border border-secondary" style={{ background: "rgba(0,0,0,0.3)" }}>
                              <div className="text-uppercase" style={{ color: "var(--accent-warning)", fontSize: "0.7rem", letterSpacing: "1px" }}>Carbs</div>
                              <div className="text-white mt-1 fs-6">{d.carbs}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded border border-secondary" style={{ background: "rgba(0,0,0,0.3)" }}>
                              <div className="text-uppercase" style={{ color: "var(--accent-red)", fontSize: "0.7rem", letterSpacing: "1px" }}>Fat</div>
                              <div className="text-white mt-1 fs-6">{d.fat}g</div>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="p-2 rounded border border-secondary" style={{ background: "rgba(0,0,0,0.3)" }}>
                              <div className="text-uppercase" style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "1px" }}>Sodium</div>
                              <div className="text-white mt-1 fs-6">{d.sodiumContent}mg</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-end small">
                          <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                            Glycemic Index: <span className="text-white">{d.glycemicIndex}</span>
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