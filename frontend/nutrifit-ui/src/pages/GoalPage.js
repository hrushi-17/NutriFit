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
    <div className="container py-3">

      <h4 className="fw-bold mb-4 text-white" style={{ letterSpacing: "1px" }}>My Goals</h4>

      <div className="row g-3 align-items-stretch">

        {/* SET GOAL */}
        <div className="col-xl-4">
          <div className="glass-panel h-100 p-0 overflow-hidden d-flex flex-column">
            <div className="fw-bold text-center text-white p-3 mb-2 border-bottom" style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(229,9,20,0.3)" }}>Set Your Goal</div>

            <div className="card-body p-3 d-flex flex-column justify-content-between h-100">

              <div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-light">Goal Type</label>
                  <select
                    className="form-select netflix-input form-select-sm"
                    value={goalType}
                    onChange={e => setGoalType(e.target.value)}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fitness">Stay Fit</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-light">Target Weight</label>
                  <input
                    type="number"
                    className="form-control netflix-input form-control-sm"
                    placeholder="Enter target weight"
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-light">Target Date</label>
                  <input
                    type="date"
                    className="form-control netflix-input form-control-sm"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={todayDate} // Prevent past date selection
                  />
                </div>
              </div>

              <button
                className="btn btn-netflix fw-bold w-100 mt-auto shadow-lg"
                onClick={setGoalHandler}
              >
                Set / Update Goal
              </button>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="col-xl-8">

          {/* CURRENT GOAL */}
          {goal && (
            <div className="glass-panel mb-3 overflow-hidden p-0">
              <div className="fw-bold px-3 py-2 text-white border-bottom" style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(229,9,20,0.3)", letterSpacing: "1px", fontSize: "0.85rem", textTransform: "uppercase" }}>Current Goal</div>

              <div className="card-body p-3">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-4">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">Goal Type</span>
                      <h5 className="text-white mb-0">{goal.goalType}</h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">Target Weight</span>
                      <h4 className="text-white mb-0">{goal.targetValue} kg</h4>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-2">Status</span>
                      <h5 className="mb-0">
                        <span className={`badge px-3 py-2 ${goal.status === "completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                          }`}>
                          {goal.status}
                        </span>
                      </h5>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* BODY STATUS */}
          {latest && (
            <div className="glass-panel overflow-hidden p-0">
              <div className="fw-bold px-3 py-2 text-white border-bottom" style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(229,9,20,0.3)", letterSpacing: "1px", fontSize: "0.85rem", textTransform: "uppercase" }}>Current Body Status</div>

              <div className="card-body p-3">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">Weight</span>
                      <h5 className="text-white mb-0">{latest.weight} kg</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">BMI</span>
                      <h5 className="text-white mb-0">{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">Category</span>
                      <h6 className="text-white mb-0">{latest.weightCategory}</h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 border border-secondary text-center d-flex flex-column justify-content-center">
                      <span className="text-muted small text-uppercase mb-1">Last Update</span>
                      <h6 className="text-white mb-0">{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RESET ZONE */}
      <div className="mt-4 animate-fade-up delay-2">
        <div className="glass-panel d-flex justify-content-between align-items-center p-4" style={{ borderLeft: "4px solid rgba(229,9,20,0.6)" }}>
          <div>
            <h6 className="fw-bold text-white mb-1" style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.85rem" }}>Danger Zone</h6>
            <div className="text-light small mt-2">
              Resetting will permanently remove all your goal and progress history.
            </div>
          </div>

          <button
            className="btn btn-outline-danger shadow-lg fw-bold px-4"
            onClick={resetAllHandler}
          >
            ❌ Reset All Data
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* 🎨 ENTERPRISE GOAL UI */}
      {/* ===================== */}
      <style>{`
        /* Styles moved to global index.js / inline classes */
      `}</style>
    </div>
  );
}
