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
    if (i === "moderate") return "bg-warning text-white";
    return "bg-danger";
  };

  if (loading)
    return (
      <div className="text-center fw-bold mt-4 text-light">
        <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading your workout plan...
      </div>
    );

  return (
    <div className="row justify-content-center animate-fade-down">
      <div className="col-md-10">

        <div className="glass-panel border-0 p-3">
          <div className="fw-bold text-center fs-5 text-uppercase border-bottom pb-3 mb-3 text-white" style={{ letterSpacing: "2px", borderColor: "rgba(229,9,20,0.3)" }}>
            Your Weekly Workout Plan (Mon – Sat)
          </div>

          <div className="card-body px-0">

            {list.length === 0 && (
              <div className="p-3 w-100 rounded text-center fw-semibold mb-3" style={{ background: "rgba(0, 136, 255, 0.1)", border: "1px solid rgba(0, 136, 255, 0.3)", color: "#0088ff" }}>
                <i className="fa-solid fa-circle-info me-2"></i> No workout plan matched your profile yet.
                <br />
                Please update your profile and health conditions.
              </div>
            )}

            {list.map((w, i) => (
              <div key={i} className="glass-panel mb-3 shadow-sm" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "3px solid rgba(229,9,20,0.4)" }}>
                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-white text-uppercase mb-0">{w.dayName}</h5>
                    <span className={`badge ${getBadge(w.intensity)} px-3 py-2 border`}>
                      {w.intensity.toUpperCase()}
                    </span>
                  </div>

                  <h5 className="fw-bold text-light mb-3">{w.workoutName}</h5>

                  <div className="row mt-2 g-2">
                    <div className="col-md-4">
                      <div className="bg-dark p-2 rounded border border-secondary text-center text-muted small text-uppercase">
                        Run Type <b className="d-block text-white fs-6 mt-1">{w.workoutType}</b>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-dark p-2 rounded border border-secondary text-center text-muted small text-uppercase">
                        Duration <b className="d-block text-white fs-6 mt-1">{w.durationMinutes} min</b>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-dark p-2 rounded border border-secondary text-center text-muted small text-uppercase">
                        Level <b className="d-block text-white fs-6 mt-1">{w.intensity}</b>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 small px-3 py-2 rounded text-warning" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                    <i className="fa-solid fa-shield-halved me-2"></i> Health note: {w.healthSafe}
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}