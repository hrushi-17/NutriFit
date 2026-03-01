import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/axios";
import $ from "jquery";
import Chart from "chart.js/auto";

export default function ProgressPage() {
  const [weight, setWeight] = useState("");
  const [latest, setLatest] = useState(null);

  const chartRef = useRef(null);   // ✅ store chart instance safely

  const loadLatest = useCallback(async () => {
    const res = await api.get("/progress/latest");
    setLatest(res.data);
  }, []);

  const loadGraph = useCallback(async () => {
    const res = await api.get("/progress/my");
    const data = res.data;
    if (!data || data.length === 0) return;

    const labels = data.map(x => {
      const date = new Date(x.date);
      return date.toLocaleDateString();
    });
    const weights = data.map(x => x.weight);
    const bmis = data.map(x => x.bmi);

    // ✅ always destroy old chart first
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    $("#graphPanel").hide().fadeIn(700);

    const ctx = document.getElementById("progressChart");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#3b82f6",
            pointRadius: 4,
            tension: 0.4,
            borderWidth: 3,
            fill: true
          },
          {
            label: "BMI",
            data: bmis,
            borderColor: "#e50914",
            backgroundColor: "rgba(229, 9, 20, 0.1)",
            pointBackgroundColor: "#e50914",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#e50914",
            pointRadius: 4,
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }, []);

  useEffect(() => {
    loadLatest();
    loadGraph();
  }, [loadLatest, loadGraph]);

  const saveProgress = async () => {
    if (!weight) return alert("Enter weight");

    await api.post("/progress/add?weight=" + weight);
    setWeight("");

    loadLatest();
    loadGraph();

    $(".kpi-card").addClass("pulse");
    setTimeout(() => $(".kpi-card").removeClass("pulse"), 600);
  };

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

  return (
    <div className="container py-3">

      <h4 className="fw-bold mb-3 text-white" style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "1.2rem" }}>Progress Tracker</h4>

      {/* ===== ROW 1 ===== */}
      <div className="row g-3 align-items-stretch mb-4">

        {/* PROGRESS TRACKER – 60% */}
        {latest && (
          <div className="col-lg-7">
            <div className="glass-panel h-100 overflow-hidden p-0" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
              <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-chart-line text-danger"></i> Progress Snapshot
              </div>

              <div className="card-body p-4 d-flex align-items-center">
                <div className="row g-3 w-100 align-items-stretch">

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center kpi-card" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Weight</span>
                      <h5 style={{ color: "#fff", fontWeight: "800", margin: 0 }}>{latest.weight} <span style={{ fontSize: "0.7rem", color: "#888" }}>kg</span></h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center kpi-card" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>BMI</span>
                      <h5 style={{ color: getBmiStyle(latest.bmi).color, fontWeight: "900", margin: 0, textShadow: `0 0 10px ${getBmiStyle(latest.bmi).color}40` }}>{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center kpi-card" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
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
                    <div className="p-3 rounded h-100 text-center d-flex flex-column justify-content-center kpi-card" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                      <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Last Update</span>
                      <h6 style={{ color: "#fff", fontWeight: "800", margin: 0 }}>{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD PROGRESS – 40% */}
        <div className="col-lg-5">
          <div className="glass-panel h-100 overflow-hidden p-0 d-flex flex-column" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)" }}>
            <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-plus text-danger"></i> Add Today’s Progress
            </div>

            <div className="card-body p-4 d-flex flex-column justify-content-between h-100">

              <div>
                <label className="form-label fw-bold mb-3" style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Today’s Weight
                </label>

                <div className="d-flex gap-2 mb-3">
                  <input
                    type="number"
                    className="form-control netflix-input text-white"
                    placeholder="Enter weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.3s" }}
                  />
                  <button
                    className="btn btn-netflix fw-bold px-4"
                    onClick={saveProgress}
                    style={{ fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)", whiteSpace: "nowrap" }}
                  >
                    Save
                  </button>
                </div>
              </div>

              <small className="mt-auto d-block" style={{ color: "#a3a3a3", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                <i className="fa-solid fa-circle-info me-1" style={{ color: "rgba(255,255,255,0.3)" }}></i> Daily updates immediately improve AI coaching accuracy.
              </small>

            </div>
          </div>
        </div>

      </div>

      {/* ===== ROW 2: GRAPH ===== */}
      <div className="row">
        <div className="col-12">
          <div className="glass-panel overflow-hidden p-0" id="graphPanel" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-chart-area text-danger"></i> Weight & BMI Progress Analytics
            </div>
            <div className="card-body p-4" style={{ height: 380 }}>
              <canvas id="progressChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* 🎨 CORPORATE PROGRESS UI */}
      {/* ===================== */}
      <style>{`
        .pulse {
          animation:pulseAnim .6s;
        }

        @keyframes pulseAnim {
          0% { transform:scale(1); box-shadow: 0 0 0 rgba(255,255,255,0.2) }
          50% { transform:scale(1.04); box-shadow: 0 0 20px rgba(255,255,255,0.4) }
          100% { transform:scale(1); box-shadow: 0 0 0 rgba(255,255,255,0) }
        }
      `}</style>
    </div>
  );
}
