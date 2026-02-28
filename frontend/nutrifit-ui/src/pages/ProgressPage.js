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
            tension: 0.4,
            borderWidth: 3
          },
          {
            label: "BMI",
            data: bmis,
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

  return (
    <div className="container py-3">

      <h4 className="fw-bold mb-3 text-primary">📈 Progress Tracker</h4>

      {/* ===== ROW 1 ===== */}
      <div className="row g-3 align-items-stretch mb-3">

        {/* PROGRESS TRACKER – 60% */}
        {latest && (
          <div className="col-lg-7">
            <div className="glass-panel neon-sky-blue h-100 overflow-hidden p-0" style={{ borderTop: "3px solid #06b6d4" }}>
              <div className="fw-bold px-3 py-2 text-info border-bottom border-info" style={{ background: "rgba(0,0,0,0.5)" }}>
                📊 Progress Tracker
              </div>

              <div className="card-body p-3 d-flex align-items-center">
                <div className="row g-2 w-100">

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 text-center border border-secondary kpi-card">
                      <span className="small text-muted text-uppercase mb-1 d-block">Weight</span>
                      <h5 className="text-white mb-0">{latest.weight} kg</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 text-center border border-secondary kpi-card">
                      <span className="small text-muted text-uppercase mb-1 d-block">BMI</span>
                      <h5 className="text-white mb-0">{latest.bmi}</h5>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 text-center border border-secondary kpi-card">
                      <span className="small text-muted text-uppercase mb-1 d-block">Category</span>
                      <h6 className="text-white mb-0">{latest.weightCategory}</h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="bg-dark p-3 rounded h-100 text-center border border-secondary kpi-card">
                      <span className="small text-muted text-uppercase mb-1 d-block">Last Update</span>
                      <h6 className="text-white mb-0">{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD PROGRESS – 40% */}
        <div className="col-lg-5">
          <div className="glass-panel neon-blue h-100 overflow-hidden p-0" style={{ borderTop: "3px solid #3b82f6" }}>
            <div className="fw-bold px-3 py-2 text-primary border-bottom border-primary" style={{ background: "rgba(0,0,0,0.5)" }}>
              ➕ Add Today’s Progress
            </div>

            <div className="card-body p-3 d-flex flex-column justify-content-center h-100">

              <label className="form-label fw-semibold small text-light">
                Today’s Weight
              </label>

              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control netflix-input"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <button
                  className="btn btn-hero-primary shadow-lg fw-bold px-4 border"
                  onClick={saveProgress}
                >
                  Save
                </button>
              </div>

              <small className="text-light">
                Daily updates improve plan accuracy.
              </small>

            </div>
          </div>
        </div>

      </div>

      {/* ===== ROW 2: GRAPH ===== */}
      <div className="row">
        <div className="col-12">
          <div className="glass-panel text-white overflow-hidden p-0" id="graphPanel" style={{ background: "rgba(10, 10, 10, 0.8)", borderTop: "3px solid #ff0a16" }}>
            <div className="fw-bold px-3 py-2 border-bottom text-uppercase" style={{ background: "rgba(0,0,0,0.5)", color: "#ff0a16", letterSpacing: "1px", borderColor: "rgba(255, 10, 22, 0.3)" }}>
              📈 Weight & BMI Progress Analytics
            </div>
            <div className="card-body p-3" style={{ height: 360 }}>
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