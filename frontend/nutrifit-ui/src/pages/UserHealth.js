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
    alert("✅ Health conditions saved successfully");
  };

  return (
    <div className="container py-3 animate-fade-up">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <div className="premium-card">
            <div className="card-header border-0 pb-0" style={{ background: "transparent" }}>
              <h4 className="fw-bold text-center mb-0 text-white">
                ❤️ Select Your Health Conditions
              </h4>
            </div>

            <div className="card-body">
              <p className="text-muted text-center mb-4 fs-5">
                Choose conditions so we can generate safe, personalized plans for you.
              </p>

              {/* HEALTH GRID */}
              <div className="row g-3 mb-4">
                {list.map((h, index) => {
                  const isActive = selected.includes(h.healthConditionId);
                  // Calculate stagger delay based on index (up to 5 for CSS classes)
                  const delayClass = `delay-${Math.min((index % 5) + 1, 5)}`;

                  return (
                    <div key={h.healthConditionId} className={`col-md-4 col-6 animate-fade-up ${delayClass}`}>
                      <div
                        onClick={() => toggle(h.healthConditionId)}
                        style={{
                          background: isActive ? "rgba(229, 9, 20, 0.15)" : "rgba(255,255,255,0.03)",
                          border: isActive ? "2px solid var(--accent-red)" : "2px solid var(--border-light)",
                          borderRadius: "14px",
                          padding: "16px 12px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          height: "100%",
                          boxShadow: isActive ? "0 0 20px rgba(229, 9, 20, 0.2)" : "none",
                          transform: isActive ? "translateY(-3px)" : "none"
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.borderColor = "var(--border-light)";
                          }
                        }}
                      >
                        <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                          {isActive ? "❤️" : "🩺"}
                        </div>
                        <div className="fw-bold text-white mb-2" style={{ letterSpacing: "0.5px" }}>{h.name}</div>

                        {/* Custom Animated Checkbox */}
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: isActive ? "none" : "2px solid var(--text-muted)",
                            background: isActive ? "var(--accent-red)" : "transparent",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          {isActive && <i className="fa-solid fa-check text-white" style={{ fontSize: "14px" }}></i>}
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
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  color: "var(--accent-green)",
                  fontWeight: "600"
                }}>
                  <i className="fa-solid fa-leaf me-2"></i> You have not selected any health conditions. We'll generate a standard plan.
                </div>
              )}

              <button
                className="btn-netflix w-100 py-3 fs-5 animate-fade-up delay-5"
                onClick={save}
              >
                💾 Save Health Profile
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}