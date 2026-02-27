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



  if (loading)
    return (
      <div className="text-center fw-bold mt-4 text-muted text-uppercase" style={{ letterSpacing: "1px" }}>
        Loading Workout Protocol...
      </div>
    );

  return (
    <div className="row justify-content-center animate-fade-up">
      <div className="col-md-10">

        <div className="netflix-card p-4 mb-4">
          <div className="text-center mb-4">
            <h4 className="fw-bolder mb-1 text-white text-uppercase" style={{ letterSpacing: "2px" }}>
              WEEKLY WORKOUT DIRECTIVE
            </h4>
            <p className="text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Mon – Sat Schedule</p>
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
                No workout plan matched your profile yet. Please update your profile and health conditions.
              </div>
            )}

            <div className="row g-4">
              {list.map((w, i) => {
                const delayClass = `delay-${Math.min((i % 5) + 1, 5)}`;

                const isLow = w.intensity.toLowerCase() === 'low';
                const isMod = w.intensity.toLowerCase() === 'moderate';
                const accentColor = isLow ? 'var(--accent-green)' : (isMod ? 'var(--accent-warning)' : 'var(--accent-red)');

                return (
                  <div key={i} className={`col-md-6 animate-fade-up ${delayClass}`}>
                    <div
                      className="p-4"
                      style={{
                        background: "var(--bg-card-hover)",
                        border: "1px solid var(--border-light)",
                        borderLeft: `4px solid ${accentColor}`,
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.background = "var(--bg-card-hover)";
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                        <h5 className="fw-bolder mb-0 text-white text-uppercase" style={{ letterSpacing: '1px' }}>
                          <span className="text-muted me-2" style={{ fontWeight: 400 }}>{w.dayName.substring(0, 3)}</span>
                          {w.dayName}
                        </h5>
                        <div
                          className="fw-bold"
                          style={{ color: accentColor, letterSpacing: '1px', fontSize: '0.85rem' }}
                        >
                          {w.intensity.toUpperCase()} INTENSITY
                        </div>
                      </div>

                      <h5 className="fw-bold mb-3 text-white">{w.workoutName}</h5>

                      <div className="row mt-2 text-muted fw-semibold small g-2 bg-dark border border-secondary p-2 rounded">
                        <div className="col-5">
                          <span className="text-uppercase" style={{ fontSize: "0.7rem", color: "var(--accent-blue)", display: "block", letterSpacing: "1px", marginBottom: "2px" }}>Type</span>
                          <span className="text-white">{w.workoutType}</span>
                        </div>
                        <div className="col-7">
                          <span className="text-uppercase" style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", letterSpacing: "1px", marginBottom: "2px" }}>Duration</span>
                          <span className="text-white">{w.durationMinutes} MINUTES</span>
                        </div>
                      </div>

                      <div className="mt-4 small d-flex justify-content-between align-items-center">
                        <span className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Health Safe</span>
                        <span className="fw-bold" style={{ color: "var(--accent-green)" }}>{w.healthSafe}</span>
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