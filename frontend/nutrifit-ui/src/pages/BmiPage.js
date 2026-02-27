import api from "../api/axios";
import { useState } from "react";

export default function BmiPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [displayBmi, setDisplayBmi] = useState(0);

  const calculateBmi = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      setError("Please enter valid height and weight.");
      return;
    }
    setError("");
    const hInMeters = height / 100;
    const finalBmi = weight / (hInMeters * hInMeters);
    const roundedBmi = parseFloat(finalBmi.toFixed(2));
    setBmi(roundedBmi);

    if (roundedBmi < 18.5) setStatus("Underweight");
    else if (roundedBmi < 24.9) setStatus("Normal");
    else if (roundedBmi < 29.9) setStatus("Overweight");
    else setStatus("Obese");

    // Count up animation
    let start = 0;
    const duration = 900;
    const stepTime = 15;
    const increment = roundedBmi / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= roundedBmi) {
        setDisplayBmi(roundedBmi);
        clearInterval(timer);
      } else {
        setDisplayBmi(parseFloat(start.toFixed(2)));
      }
    }, stepTime);
  };

  const getColor = (s) => {
    if (s === "Underweight") return "#f59e0b";
    if (s === "Normal") return "#10b981"; // neon green
    if (s === "Overweight") return "#f97316";
    if (s === "Obese") return "#e50914"; // netflix red
    return "#3b82f6";
  };

  const getMessage = (s) => {
    if (s === "Underweight") return "You are underweight. Consider increasing your caloric intake safely.";
    if (s === "Normal") return "Great job! You are in a healthy weight range.";
    if (s === "Overweight") return "You are overweight. A balanced diet and regular exercise can help.";
    if (s === "Obese") return "You are in the obese range. Please consult a healthcare professional.";
    return "";
  };

  const saveBmi = () => {
    alert("BMI saved to progress! (API integration pending)");
  };

  return (
    <div className="row justify-content-center mt-3 animate-fade-up">
      <div className="col-lg-8">

        {/* --- MAIN CALCULATOR CARD --- */}
        <div className="premium-card mb-4">
          <div className="card-header border-0 pb-0" style={{ background: "transparent" }}>
            <h4 className="fw-bold text-center mb-0 text-white">
              📊 Calculate Your BMI
            </h4>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert animate-fade-up mb-4" style={{ background: "rgba(229, 9, 20, 0.1)", color: "var(--accent-red)", border: "1px solid var(--accent-red)" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6 animate-fade-up delay-1">
                <label className="fw-semibold text-muted mb-1">Height (cm)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-muted">📏</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 animate-fade-up delay-1">
                <label className="fw-semibold text-muted mb-1">Weight (kg)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-muted">⚖️</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn-health w-100 mt-4 py-3 fs-5 animate-fade-up delay-2"
              onClick={calculateBmi}
              style={{ fontWeight: 700 }}
            >
              🚀 Calculate Now
            </button>
          </div>
        </div>

        {/* --- RESULT CARD --- */}
        {bmi > 0 && (
          <div className="premium-card text-center overflow-hidden animate-fade-up delay-3" style={{ borderTop: `4px solid ${getColor(status)}` }}>
            <div className="card-body py-5 position-relative">

              {/* Decorative Background Glow Blob */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${getColor(status)}22 0%, transparent 70%)`,
                zIndex: 0,
                pointerEvents: 'none'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h5 className="text-muted fw-bold mb-4 text-uppercase" style={{ letterSpacing: '2px' }}>Your Result</h5>

                <div
                  className="mx-auto d-flex flex-column justify-content-center align-items-center"
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    border: `6px solid ${getColor(status)}`,
                    boxShadow: `0 0 30px ${getColor(status)}40`,
                    background: "var(--bg-card-hover)",
                    animation: "pulse-glow 2s infinite"
                  }}
                >
                  <span className="display-3 fw-bolder mb-0 text-white">
                    {displayBmi}
                  </span>
                  <span className="small text-muted fw-semibold text-uppercase mt-1" style={{ letterSpacing: '2px' }}>BMI</span>
                </div>

                <div className="mt-5">
                  <h2 className="fw-bolder mb-2" style={{ color: getColor(status), letterSpacing: '1px' }}>
                    {status.toUpperCase()}
                  </h2>
                  <p className="text-muted px-4 fs-5">
                    {getMessage(status)}
                  </p>
                </div>

                <button
                  className="btn btn-outline-glass mt-4 px-5 py-2 rounded-pill fw-bold text-uppercase"
                  onClick={saveBmi}
                >
                  💾 Save to Progress
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}