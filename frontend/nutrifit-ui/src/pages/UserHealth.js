import api from "../api/axios";
import { useEffect, useState } from "react";

export default function UserHealth() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get("/user/health/all").then(res => setList(res.data));
    api.get("/user/health").then(res => setSelected(res.data));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const save = async () => {
    await api.post("/user/health", selected);
    alert("Health conditions saved successfully");
  };

  return (
    <div className="container py-3 animate-fade-up">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <div className="netflix-card p-4">
            <div className="text-center mb-4">
              <h4 className="fw-bolder mb-2 text-white text-uppercase" style={{ letterSpacing: "2px" }}>
                HEALTH CONDITIONS
              </h4>
              <p className="text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>
                Select conditions to generate safe, personalized plans.
              </p>
            </div>

            <div className="card-body p-0">

              {/* HEALTH GRID */}
              <div className="row g-3 mb-4">
                {list.map((h, index) => {
                  const isActive = selected.includes(h.healthConditionId);
                  const delayClass = `delay-${Math.min((index % 5) + 1, 5)}`;

                  return (
                    <div key={h.healthConditionId} className={`col-md-4 col-6 animate-fade-up ${delayClass}`}>
                      <div
                        onClick={() => toggle(h.healthConditionId)}
                        style={{
                          background: isActive ? "rgba(229, 9, 20, 0.15)" : "var(--bg-card-hover)",
                          border: isActive ? "2px solid var(--accent-red)" : "2px solid var(--border-light)",
                          borderRadius: "8px",
                          padding: "16px 12px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          height: "100%",
                          boxShadow: isActive ? "0 0 15px rgba(229, 9, 20, 0.3)" : "none",
                          transform: isActive ? "translateY(-3px)" : "none"
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.borderColor = "var(--border-light)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.borderColor = "var(--border-light)";
                            e.currentTarget.style.background = "var(--bg-card-hover)";
                          }
                        }}
                      >

                        <div className="fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.85rem" }}>{h.name}</div>

                        {/* Custom Animated Checkbox */}
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            border: isActive ? "none" : "2px solid var(--text-muted)",
                            background: isActive ? "var(--accent-red)" : "transparent",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          {isActive && <div style={{ width: "10px", height: "10px", backgroundColor: "white", borderRadius: "2px" }}></div>}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NO DISEASE UI */}
              {selected.length === 0 && (
                <div className="animate-fade-up delay-5 mb-4" style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid var(--accent-green)",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  color: "var(--accent-green)",
                  fontWeight: "600"
                }}>
                  You have not selected any health conditions. A standard unrestricted plan will be generated.
                </div>
              )}

              <button
                className="btn-netflix w-100 py-3 fs-5 fw-bold animate-fade-up delay-5"
                onClick={save}
              >
                SAVE HEALTH PROFILE
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}