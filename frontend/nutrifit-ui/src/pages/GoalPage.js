import { useEffect, useState } from "react";
import api from "../api/axios";

export default function GoalPage() {
  const [goalType, setGoalType] = useState("weight_loss");
  const [targetValue, setTargetValue] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState(null);
  const [latest, setLatest] = useState(null);
  const [msg, setMsg] = useState("");

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
      setMsg("❌ Please select a valid date (today or future date only).");
      return;
    }

    try {
      await api.post("/goals/set", {
        goalType,
        targetValue,
        endDate
      });

      setMsg("✅ Goal set successfully!");
      setTimeout(() => setMsg(""), 3000);
      loadGoal();
    } catch (err) {
      setMsg("❌ Failed to set goal.");
    }
  };

  const resetAllHandler = async () => {
    if (!window.confirm("This will delete all your goal and progress history. Continue?"))
      return;

    try {
      await api.delete("/goals/reset");
      setGoal(null);
      setLatest(null);
      setMsg("✅ All data cleared. You can start fresh.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ Failed to reset data.");
    }
  };

  // Today's date in YYYY-MM-DD format for min attribute
  const todayDate = new Date().toISOString().split("T")[0];

  const getBmiStyle = (bmi) => {
    const val = parseFloat(bmi);
    if (!val) return { color: "#fff" };
    if (val < 18.5) return { color: "#60a5fa" }; // Underweight - Blue
    if (val >= 18.5 && val <= 24.9) return { color: "#22c55e" }; // Normal - Green
    if (val >= 25 && val <= 29.9) return { color: "#f59e0b" }; // Overweight - Orange
    return { color: "#e50914" }; // Obese - Red
  };

  const getCategoryStyle = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("under")) return { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "rgba(96,165,250,0.4)" };
    if (cat.includes("normal") || cat.includes("healthy")) return { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.4)" };
    if (cat.includes("over")) return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "rgba(245,158,11,0.4)" };
    return { bg: "linear-gradient(145deg, rgba(229, 9, 20, 0.3), rgba(130, 0, 0, 0.15))", color: "#fff", border: "rgba(229,9,20,0.5)" }; // Obese default red gradient
  };

  const getDynamicGoalStatus = (currentGoal, currentLatest) => {
    if (!currentGoal) return "in_progress";
    if (currentGoal.status === "completed") return "completed";

    // Safely extract the latest weight depending on if the API returned an array or object
    let latestWeightObj = Array.isArray(currentLatest) ? currentLatest[0] : currentLatest;
    if (!latestWeightObj || !latestWeightObj.weight) return currentGoal.status;

    const currentWeight = parseFloat(latestWeightObj.weight);
    const target = parseFloat(currentGoal.targetValue);

    // Normalize string to handle "Weight Loss" vs "weight_loss" from DB
    const gType = (currentGoal.goalType || "").toLowerCase().replace(/_/g, " ");

    if (gType.includes("weight loss") && currentWeight <= target) return "completed";
    if (gType.includes("muscle gain") && currentWeight >= target) return "completed";

    return currentGoal.status;
  };

  const dynamicStatus = getDynamicGoalStatus(goal, latest);

  return (
    <div className="container py-3">

      <h4 className="fw-bold mb-4 text-white" style={{ letterSpacing: "1px" }}>My Goals</h4>

      {/* Message Display */}
      {msg && (
        <div className={`premium-alert mb-4 ${msg.startsWith("✅") ? "premium-alert-success" : "premium-alert-error"}`}>
          <i className={`fa-solid ${msg.startsWith("✅") ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
          {msg.replace("✅ ", "").replace("❌ ", "")}
        </div>
      )}

      <div className="row g-3 align-items-stretch">

        {/* SET GOAL */}
        <div className="col-xl-4">
          <div className="glass-panel h-100 p-0 overflow-hidden d-flex flex-column" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)" }}>
            <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.9rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-bullseye text-danger"></i> Set Your Goal
            </div>

            <div className="card-body p-4 d-flex flex-column justify-content-between h-100">

              <div>
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2" style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>Goal Type</label>
                  <select
                    className="form-select netflix-input"
                    value={goalType}
                    onChange={e => setGoalType(e.target.value)}
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.3s" }}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fitness">Stay Fit</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold mb-2" style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>Target Weight</label>
                  <input
                    type="number"
                    className="form-control netflix-input"
                    placeholder="Enter target weight (kg)"
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.3s" }}
                  />
                </div>

                <div className="mb-5">
                  <label className="form-label fw-bold mb-2" style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>Target Date</label>
                  <input
                    type="date"
                    className="form-control netflix-input"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={todayDate} // Prevent past date selection
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.3s" }}
                  />
                </div>
              </div>

              <button
                className="btn btn-netflix fw-bold w-100 mt-auto py-3"
                style={{ fontSize: "1rem", letterSpacing: "1.5px", textTransform: "uppercase", boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)" }}
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
            <div className="glass-panel mb-4 overflow-hidden p-0" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
              <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-flag-checkered text-danger"></i> Current Goal
              </div>

              <div className="card-body p-4">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-4">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Goal Type</span>
                      <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, textTransform: "capitalize" }}>{goal.goalType.replace("_", " ")}</h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Target Weight</span>
                      <h4 style={{ color: "#e50914", fontWeight: "900", margin: 0 }}>{goal.targetValue} <span style={{ fontSize: "0.8rem", color: "#888" }}>kg</span></h4>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Status</span>
                      <h5 className="mb-0">
                        <span style={{
                          background: dynamicStatus === "completed" ? "rgba(34,197,94,0.15)" : "linear-gradient(145deg, rgba(229, 9, 20, 0.3), rgba(130, 0, 0, 0.15))",
                          color: dynamicStatus === "completed" ? "#22c55e" : "#fff",
                          border: `1px solid ${dynamicStatus === "completed" ? "rgba(34,197,94,0.3)" : "rgba(229,9,20,0.5)"}`,
                          letterSpacing: "1.5px", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", padding: "6px 16px", borderRadius: "6px",
                          boxShadow: dynamicStatus !== "completed" ? "0 4px 10px rgba(229, 9, 20, 0.2)" : "none"
                        }}>
                          {dynamicStatus}
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
            <div className="glass-panel overflow-hidden p-0" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
              <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-child-reaching text-danger"></i> Current Body Status
              </div>

              <div className="card-body p-4">
                <div className="row g-3 align-items-stretch">

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Weight</span>
                      <h5 style={{ color: "#fff", fontWeight: "800", margin: 0 }}>{latest.weight} <span style={{ fontSize: "0.7rem", color: "#888" }}>kg</span></h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>BMI</span>
                      <h5 style={{ color: getBmiStyle(latest.bmi).color, fontWeight: "900", margin: 0, textShadow: `0 0 10px ${getBmiStyle(latest.bmi).color}40` }}>{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Category</span>
                      <h6 className="mb-0">
                        <span style={{
                          background: getCategoryStyle(latest.weightCategory).bg,
                          color: getCategoryStyle(latest.weightCategory).color,
                          border: `1px solid ${getCategoryStyle(latest.weightCategory).border}`,
                          letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.65rem", fontWeight: "800", padding: "6px 12px", borderRadius: "6px",
                          boxShadow: `0 4px 10px ${getCategoryStyle(latest.weightCategory).border.replace('0.4)', '0.2)')}`,
                          display: "inline-block"
                        }}>
                          {latest.weightCategory}
                        </span>
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Last Update</span>
                      <h6 style={{ color: "#fff", fontWeight: "800", margin: 0 }}>{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* DANGER ZONE */}
          <div className="glass-panel mt-3 overflow-hidden p-0 animate-fade-up delay-2" style={{ background: "rgba(15,15,15,0.9)", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
            <div className="d-flex justify-content-between align-items-center p-4">
              <div>
                <h6 className="fw-bold text-white mb-1" style={{ letterSpacing: "1.5px", textTransform: "uppercase", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <i className="fa-solid fa-triangle-exclamation text-danger"></i> Danger Zone
                </h6>
                <div style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                  Resetting will permanently remove all your goal and progress history.
                </div>
              </div>

              <button
                className="btn btn-netflix fw-bold px-4 py-2"
                style={{ fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}
                onClick={resetAllHandler}
              >
                <i className="fa-solid fa-trash-can"></i> Reset All Data
              </button>
            </div>
          </div>

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
