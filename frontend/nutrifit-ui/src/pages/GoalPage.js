import { useEffect, useState } from "react";
import api from "../api/axios";

export default function GoalPage() {
  const [goalType, setGoalType] = useState("weight_loss");
  const [targetValue, setTargetValue] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState(null);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    loadGoal();
    loadLatestProgress();
  }, []);

  const loadGoal = async () => {
    const res = await api.get("/goals/my");
    setGoal(res.data);
  };

  const loadLatestProgress = async () => {
    const res = await api.get("/progress/latest");
    setLatest(res.data);
  };

  const setGoalHandler = async () => {
    // Validate that selected date is today or in the future
    const today = new Date().toISOString().split("T")[0];
    if (endDate < today) {
      alert("⚠ Please select a valid date (today or future date only).");
      return;
    }

    await api.post("/goals/set", {
      goalType,
      targetValue,
      endDate
    });

    alert("Goal set successfully");
    loadGoal();
  };

  const resetAllHandler = async () => {
    if (!window.confirm("This will delete all your goal and progress history. Continue?"))
      return;

    await api.delete("/goals/reset");
    setGoal(null);
    setLatest(null);
    alert("All data cleared. You can start fresh.");
  };

  // Today's date in YYYY-MM-DD format for min attribute
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container py-3 animate-fade-up">

      <h4 className="fw-bold mb-4 text-white" style={{ letterSpacing: "1px" }}>🎯 My Goal</h4>

      <div className="row g-4 align-items-stretch">

        {/* SET GOAL */}
        <div className="col-xl-4 animate-fade-up delay-1">
          <div className="premium-card h-100">
            <div className="card-header border-0 pb-0" style={{ background: "transparent" }}>
              <h5 className="fw-bold text-center mb-0" style={{ color: "var(--accent-blue)" }}>
                🎯 Set Your Goal
              </h5>
            </div>

            <div className="card-body d-flex flex-column justify-content-between mt-2">

              <div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted small">Goal Type</label>
                  <select
                    className="form-select"
                    value={goalType}
                    onChange={e => setGoalType(e.target.value)}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fitness">Stay Fit</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-muted small">Target Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter target weight"
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small">Target Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={todayDate} // Prevent past date selection
                  />
                </div>
              </div>

              <button
                className="btn-netflix w-100 mt-2 py-2 fw-bold"
                style={{ background: "var(--accent-blue)" }}
                onClick={setGoalHandler}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.4)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                💾 Save Goal
              </button>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="col-xl-8">

          {/* CURRENT GOAL */}
          {goal && (
            <div className="premium-card mb-4 animate-fade-up delay-2">
              <div className="card-header border-0 pb-0 pt-3" style={{ background: "transparent" }}>
                <h6 className="fw-bold mb-0" style={{ color: "var(--accent-green)", letterSpacing: "1px" }}>
                  <i className="fa-solid fa-thumbtack me-2"></i> CURRENT GOAL
                </h6>
              </div>

              <div className="card-body">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">Type</span>
                      <h5 className="fw-bold text-white mb-0 text-capitalize">{goal.goalType.replace("_", " ")}</h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">Target Weight</span>
                      <h4 className="fw-bolder mb-0" style={{ color: "var(--accent-blue)" }}>{goal.targetValue} kg</h4>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-2 text-uppercase tracking-wider">Status</span>
                      <div>
                        <span className="badge rounded-pill px-3 py-2" style={{
                          background: goal.status === "completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: goal.status === "completed" ? "var(--accent-green)" : "var(--accent-warning)",
                          border: `1px solid ${goal.status === "completed" ? "var(--accent-green)" : "var(--accent-warning)"}`
                        }}>
                          {goal.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* BODY STATUS */}
          {latest && (
            <div className="premium-card animate-fade-up delay-3">
              <div className="card-header border-0 pb-0 pt-3" style={{ background: "transparent" }}>
                <h6 className="fw-bold mb-0 text-white" style={{ letterSpacing: "1px" }}>
                  <i className="fa-solid fa-chart-pie me-2" style={{ color: "var(--accent-warning)" }}></i> LATEST METRICS
                </h6>
              </div>

              <div className="card-body">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1">Weight</span>
                      <h5 className="fw-bold text-white mb-0">{latest.weight} kg</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1">BMI</span>
                      <h5 className="fw-bold mb-0" style={{ color: "var(--accent-blue)" }}>{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1">Category</span>
                      <h6 className="fw-bold mb-0" style={{ color: latest.weightCategory.toLowerCase() === 'normal' ? 'var(--accent-green)' : 'var(--accent-warning)' }}>{latest.weightCategory}</h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1">Updated</span>
                      <h6 className="fw-bold text-white mb-0">{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RESET ZONE */}
      <div className="animate-fade-up delay-4 mt-5">
        <div className="premium-card border-0" style={{ background: "rgba(229, 9, 20, 0.05)", border: "1px solid rgba(229, 9, 20, 0.2)" }}>
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
            <div className="mb-3 mb-md-0">
              <h5 className="fw-bold mb-1" style={{ color: "var(--accent-red)" }}><i className="fa-solid fa-triangle-exclamation me-2"></i> Danger Zone</h5>
              <p className="text-muted mb-0">
                Resetting will permanently remove all your goal and progress history. This cannot be undone.
              </p>
            </div>

            <button
              className="btn btn-outline-glass px-4 py-2"
              style={{ color: "var(--accent-red)", borderColor: "var(--accent-red)" }}
              onClick={resetAllHandler}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-red)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-red)"; }}
            >
              ❌ Reset All Data
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
