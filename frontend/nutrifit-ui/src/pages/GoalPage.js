import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/pages/Goal.css";

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
    const today = new Date().toISOString().split("T")[0];
    if (endDate < today) {
      alert("Please select a valid date (today or future date only).");
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

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container py-3 animate-fade-up">

      <h4 className="fw-bolder mb-4 text-white text-uppercase" style={{ letterSpacing: "2px" }}>GOAL CONFIGURATION</h4>

      <div className="row g-4 align-items-stretch">

        {/* SET GOAL */}
        <div className="col-xl-4 animate-fade-up delay-1">
          <div className="netflix-card h-100 p-4">
            <div className="text-center mb-4">
              <h5 className="fw-bolder mb-0 text-uppercase" style={{ color: "var(--accent-blue)", letterSpacing: "1px" }}>
                SET OBJECTIVE
              </h5>
            </div>

            <div className="card-body p-0 d-flex flex-column justify-content-between mt-2">

              <div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Goal Type</label>
                  <select
                    className="netflix-input w-100"
                    value={goalType}
                    onChange={e => setGoalType(e.target.value)}
                  >
                    <option value="weight_loss" style={{ color: "black" }}>Weight Loss</option>
                    <option value="muscle_gain" style={{ color: "black" }}>Muscle Gain</option>
                    <option value="fitness" style={{ color: "black" }}>Stay Fit</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Target Weight (kg)</label>
                  <input
                    type="number"
                    className="netflix-input w-100"
                    placeholder="Enter target weight"
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Target Date</label>
                  <input
                    type="date"
                    className="netflix-input w-100"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={todayDate}
                  />
                </div>
              </div>

              <button
                className="btn-netflix w-100 mt-2 py-3 fw-bold"
                onClick={setGoalHandler}
              >
                SAVE DIRECTIVE
              </button>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="col-xl-8">

          {/* CURRENT GOAL */}
          {goal && (
            <div className="netflix-card mb-4 p-4 animate-fade-up delay-2">
              <div className="border-bottom border-secondary pb-3 mb-3">
                <h6 className="fw-bolder mb-0 text-uppercase" style={{ color: "var(--accent-green)", letterSpacing: "1px" }}>
                  ACTIVE GOAL STATE
                </h6>
              </div>

              <div className="card-body p-0">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Type</span>
                      <h5 className="fw-bolder text-white mb-0 text-capitalize">{goal.goalType.replace("_", " ")}</h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Target Weight</span>
                      <h4 className="fw-bolder mb-0" style={{ color: "var(--accent-blue)", textShadow: "0 0 10px rgba(59, 130, 246, 0.4)" }}>{goal.targetValue} kg</h4>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)" }}>
                      <span className="small text-muted mb-2 text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>Status</span>
                      <div>
                        <span className="fw-bold fs-5 text-uppercase" style={{
                          color: goal.status === "completed" ? "var(--accent-green)" : "var(--accent-warning)",
                          letterSpacing: "1px"
                        }}>
                          {goal.status}
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
            <div className="netflix-card p-4 animate-fade-up delay-3">
              <div className="border-bottom border-secondary pb-3 mb-3">
                <h6 className="fw-bolder mb-0 text-white text-uppercase" style={{ letterSpacing: "1px" }}>
                  <span style={{ color: "var(--accent-warning)" }}>LATEST</span> METRICS
                </h6>
              </div>

              <div className="card-body p-0">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Weight</span>
                      <h5 className="fw-bold text-white mb-0">{latest.weight} kg</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>BMI</span>
                      <h5 className="fw-bold mb-0" style={{ color: "var(--accent-blue)" }}>{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Category</span>
                      <h6 className="fw-bold mb-0 text-uppercase" style={{ color: latest.weightCategory.toLowerCase() === 'normal' ? 'var(--accent-green)' : 'var(--accent-warning)', fontSize: "0.9rem" }}>{latest.weightCategory}</h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-light)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                      <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Updated</span>
                      <h6 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: "0.85rem" }}>{latest.date.split("T")[0]}</h6>
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
        <div className="netflix-card border-0" style={{ background: "rgba(229, 9, 20, 0.05)", border: "1px solid rgba(229, 9, 20, 0.2)" }}>
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
            <div className="mb-3 mb-md-0">
              <h5 className="fw-bold mb-1 text-uppercase" style={{ color: "var(--accent-red)", letterSpacing: "1px" }}>DANGER ZONE</h5>
              <p className="text-muted mb-0">
                Resetting will permanently remove all your goal and progress history. This cannot be undone.
              </p>
            </div>

            <button
              className="btn btn-outline-glass px-5 py-3 fw-bold text-uppercase"
              style={{ color: "var(--accent-red)", borderColor: "var(--accent-red)" }}
              onClick={resetAllHandler}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-red)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-red)"; }}
            >
              RESET ALL DATA
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
