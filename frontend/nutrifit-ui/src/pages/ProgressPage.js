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

    // Dark mode chart configuration
    Chart.defaults.color = "#9ca3af";
    Chart.defaults.borderColor = "rgba(255,255,255,0.05)";

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            tension: 0.4,
            borderWidth: 3,
            borderColor: "#3b82f6", // Accent Blue
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true
          },
          {
            label: "BMI",
            data: bmis,
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 2,
            borderColor: "#10b981", // Accent Green
            backgroundColor: "transparent"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#f3f4f6" }
          }
        },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } }
        }
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

    $(".kpi-metric").css("transform", "scale(1.05)");
    setTimeout(() => $(".kpi-metric").css("transform", "scale(1)"), 300);
  };

  return (
    <div className="container py-3 animate-fade-up">

      <h4 className="fw-bold mb-4 text-white" style={{ letterSpacing: "1px" }}>📈 Progress Tracker</h4>

      {/* ===== ROW 1 ===== */}
      <div className="row g-4 align-items-stretch mb-4">

        {/* PROGRESS TRACKER – 60% */}
        {latest && (
          <div className="col-lg-7 animate-fade-up delay-1">
            <div className="premium-card h-100 min-h-200">
              <div className="card-header border-0 pb-0 pt-3" style={{ background: "transparent" }}>
                <h6 className="fw-bold mb-0" style={{ color: "var(--accent-blue)", letterSpacing: "1px" }}>
                  📊 LATEST METRICS
                </h6>
              </div>

              <div className="card-body d-flex align-items-center py-3">
                <div className="row g-3 w-100">

                  <div className="col-md-3 col-6">
                    <div className="kpi-metric p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">Weight</span>
                      <h4 className="fw-bolder text-white mb-0">{latest.weight} kg</h4>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="kpi-metric p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">BMI</span>
                      <h4 className="fw-bolder mb-0" style={{ color: "var(--accent-green)" }}>{latest.bmi}</h4>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="kpi-metric p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">Category</span>
                      <h6 className="fw-bold mb-0 text-white text-capitalize">{latest.weightCategory}</h6>
                    </div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div className="kpi-metric p-3 rounded text-center h-100 d-flex flex-column justify-content-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                      <span className="small text-muted mb-1 text-uppercase tracking-wider">Updated</span>
                      <h6 className="fw-bold text-white mb-0">{latest.date.split("T")[0]}</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD PROGRESS – 40% */}
        <div className="col-lg-5 animate-fade-up delay-2">
          <div className="premium-card h-100 min-h-200">
            <div className="card-header border-0 pb-0 pt-3" style={{ background: "transparent" }}>
              <h6 className="fw-bold mb-0" style={{ color: "var(--accent-warning)", letterSpacing: "1px" }}>
                ➕ ADD TODAY'S PROGRESS
              </h6>
            </div>

            <div className="card-body d-flex flex-column justify-content-center py-3">

              <label className="form-label fw-semibold text-muted small mb-2">
                Today’s Weight (kg)
              </label>

              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", color: "white" }}
                />
                <button
                  className="btn-netflix fw-bold px-4 m-0 rounded-end"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  onClick={saveProgress}
                >
                  Save
                </button>
              </div>

              <small className="text-muted">
                <i className="fa-solid fa-bolt me-1 text-warning"></i> Daily updates improve plan accuracy and predictive insights.
              </small>

            </div>
          </div>
        </div>

      </div>

      {/* ===== ROW 2: GRAPH ===== */}
      <div className="row animate-fade-up delay-3">
        <div className="col-12">
          <div className="premium-card" id="graphPanel" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="card-header border-0 pb-0 pt-3" style={{ background: "transparent" }}>
              <h6 className="fw-bold mb-0 text-white" style={{ letterSpacing: "1px" }}>
                📈 WEIGHT & BMI PROGRESS ANALYTICS
              </h6>
            </div>
            <div className="card-body mt-2" style={{ height: 400 }}>
              <canvas id="progressChart"></canvas>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}