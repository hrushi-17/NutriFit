import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/axios";
import $ from "jquery";
import Chart from "chart.js/auto";
import "../styles/pages/Progress.css";

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
            borderColor: "#00ffff", // Neon Sky Blue
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            fill: true,
            pointBackgroundColor: "#00ffff",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00ffff",
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: "BMI",
            data: bmis,
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 3,
            borderColor: "#ff3366", // Reddish Pink
            backgroundColor: "transparent",
            pointBackgroundColor: "#ff3366",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#ff3366",
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },
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

    $(".metric-card").css("transform", "scale(1.05)");
    setTimeout(() => $(".metric-card").css("transform", "scale(1)"), 300);
  };

  return (
    <div className="progress-container animate-fade-up">

      <h4 className="progress-header-title">PROGRESS TRACKER</h4>

      {/* ===== ROW 1 ===== */}
      <div className="row g-4 align-items-stretch mb-4">

        {/* PROGRESS TRACKER */}
        {latest && (
          <div className="col-lg-8 animate-fade-up delay-1">
            <div className="netflix-card h-100 p-4">
              <h6 className="progress-form-label" style={{ color: "var(--accent-blue)" }}>
                LATEST METRICS
              </h6>

              <div className="metric-grid">
                <div className="metric-card">
                  <span className="metric-label">Weight</span>
                  <h4 className="metric-value neon-sky-blue">{latest.weight} kg</h4>
                </div>

                <div className="metric-card">
                  <span className="metric-label">BMI</span>
                  <h4 className="metric-value neon-pink">{latest.bmi}</h4>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Category</span>
                  <h6 className="metric-value text-capitalize" style={{ fontSize: "1rem" }}>{latest.weightCategory}</h6>
                </div>

                <div className="metric-card">
                  <span className="metric-label">Updated</span>
                  <h6 className="metric-value" style={{ fontSize: "1rem" }}>{latest.date.split("T")[0]}</h6>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD PROGRESS */}
        <div className="col-lg-4 animate-fade-up delay-2">
          <div className="netflix-card h-100 p-4 progress-form-card">
            <h6 className="progress-form-label" style={{ color: "var(--accent-red)" }}>
              ADD TODAY'S PROGRESS
            </h6>

            <label className="form-label text-white small mb-2">
              Body Weight (kg)
            </label>

            <div className="input-group mb-2">
              <input
                type="number"
                className="netflix-input form-control rounded-start"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <button
                className="btn-netflix fw-bold px-4 m-0 rounded-end"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, border: "1px solid var(--accent-red)" }}
                onClick={saveProgress}
              >
                Log Info
              </button>
            </div>

            <p className="progress-form-subtitle">
              <span>NOTE:</span> Daily updates improve plan accuracy and predictive insights.
            </p>
          </div>
        </div>

      </div>

      {/* ===== ROW 2: GRAPH ===== */}
      <div className="row animate-fade-up delay-3">
        <div className="col-12">
          <div className="netflix-card p-4" id="graphPanel">
            <h6 className="progress-form-label mb-3" style={{ color: "white" }}>
              WEIGHT & BMI PROGRESS ANALYTICS
            </h6>
            <div className="chart-wrapper">
              <div className="chart-canvas-container">
                <canvas id="progressChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}