import api from "../api/axios";
import { useEffect, useState } from "react";

export default function WorkoutPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/workout/weekly-plan")
      .then(res => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getBadge = (intensity) => {
    const i = intensity.toLowerCase();
    if (i === "low") return "bg-success";
    if (i === "moderate") return "bg-warning text-dark";
    return "bg-danger";
  };

  if (loading)
    return (
      <div className="text-center fw-bold mt-4">
        ⏳ Loading your workout plan...
      </div>
    );

  return (
    <div className="row justify-content-center animate-fade-up">
      <div className="col-md-10">

        <div className="premium-card mb-4" style={{ background: "var(--bg-card)" }}>
          <div className="card-header border-0 pb-0" style={{ background: "transparent" }}>
            <h4 className="fw-bold text-center mb-0 text-white" style={{ letterSpacing: "1px" }}>
              💪 Your Weekly Workout Plan
            </h4>
            <p className="text-muted text-center mt-2 mb-2">Mon – Sat</p>
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
                <i className="fa-solid fa-circle-info me-2"></i> No workout plan matched your profile yet. Please update your profile and health conditions.
              </div>
            )}

            <div className="row g-4">
              {list.map((w, i) => {
                const delayClass = `delay-${Math.min((i % 5) + 1, 5)}`;

                return (
                  <div key={i} className={`col-md-6 animate-fade-up ${delayClass}`}>
                    <div
                      className="p-3"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-light)",
                        borderLeft: `4px solid ${w.intensity.toLowerCase() === 'low' ? 'var(--accent-green)' : w.intensity.toLowerCase() === 'moderate' ? 'var(--accent-warning)' : 'var(--accent-red)'}`,
                        borderRadius: "12px",
                        transition: "transform 0.2s, background 0.2s",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0 text-white" style={{ letterSpacing: '0.5px' }}>
                          <span className="text-muted me-2 border border-secondary rounded px-2 py-1 fs-6">{w.dayName.substring(0, 3)}</span>
                          {w.dayName}
                        </h5>
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: w.intensity.toLowerCase() === 'low' ? 'rgba(16, 185, 129, 0.15)' : w.intensity.toLowerCase() === 'moderate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(229, 9, 20, 0.15)',
                            color: w.intensity.toLowerCase() === 'low' ? 'var(--accent-green)' : w.intensity.toLowerCase() === 'moderate' ? 'var(--accent-warning)' : 'var(--accent-red)',
                            border: `1px solid ${w.intensity.toLowerCase() === 'low' ? 'var(--accent-green)' : w.intensity.toLowerCase() === 'moderate' ? 'var(--accent-warning)' : 'var(--accent-red)'}`,
                            fontWeight: '600',
                            letterSpacing: '1px'
                          }}
                        >
                          {w.intensity.toUpperCase()}
                        </span>
                      </div>

                      <h5 className="fw-bold mb-3" style={{ color: "var(--accent-blue)" }}>{w.workoutName}</h5>

                      <div className="row mt-2 text-muted fw-semibold small g-2">
                        <div className="col-5"><i className="fa-solid fa-person-running me-2"></i>{w.workoutType}</div>
                        <div className="col-7"><i className="fa-regular fa-clock me-2"></i>{w.durationMinutes} min / day</div>
                      </div>

                      <hr className="my-3 opacity-25" />

                      <div className="small text-muted fw-semibold" style={{ display: 'flex', gap: '8px' }}>
                        <i className="fa-solid fa-shield-heart" style={{ marginTop: '3px', color: "var(--accent-green)" }}></i>
                        <span>{w.healthSafe}</span>
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