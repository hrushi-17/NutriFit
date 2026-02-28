import api from "../api/axios";
import { useEffect, useState } from "react";

export default function BmiPage() {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedBmi, setAnimatedBmi] = useState(0);

  useEffect(() => {
    api.get("/profile")
      .then(res => {
        setP(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🎯 BMI COUNT-UP ANIMATION (jQuery-style)
  useEffect(() => {
    if (!p?.bmi) return;

    let start = 0;
    const end = parseFloat(p.bmi.toFixed(2));
    const duration = 900;
    const stepTime = 15;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedBmi(end);
        clearInterval(timer);
      } else {
        setAnimatedBmi(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [p]);

  if (loading)
    return <div className="text-center fw-semibold mt-5">Loading BMI Report...</div>;

  if (!p) {
    return (
      <div className="alert alert-warning text-center mt-5">
        Profile not found. Please complete your profile first.
      </div>
    );
  }

  const bmiColor =
    p.weightCategory?.toLowerCase() === "low" ? "bmi-low"
      : p.weightCategory?.toLowerCase() === "normal" ? "bmi-normal"
        : "bmi-high";

  const getBadgeLabel = (cat) => {
    if (cat?.toLowerCase() === "low") return "UNDERWEIGHT";
    if (cat?.toLowerCase() === "normal") return "NORMAL";
    return "OVERWEIGHT / HIGH";
  };

  return (
    <div className="container py-2 animate-fade-down">

      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">

          <div className="glass-panel w-100 p-0" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>

            {/* HEADER */}
            <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <i className="fa-solid fa-file-medical text-danger"></i> BMI REPORT
            </div>

            <div className="card-body py-4 px-4">

              {/* BMI CIRCLE */}
              <div className="text-center mb-4">
                <div className={`bmi-circle-sm ${bmiColor}`}>
                  <div>
                    <div className="bmi-value-sm" style={{ textShadow: `0 0 15px ${bmiColor === 'bmi-low' ? '#f59e0b' : bmiColor === 'bmi-normal' ? '#22c55e' : '#e50914'}60` }}>{animatedBmi.toFixed(2)}</div>
                    <div className="bmi-label-sm">BMI</div>
                  </div>
                </div>

                <span className="badge mt-3" style={{
                  background: p.weightCategory?.toLowerCase() === "low" ? "rgba(245,158,11,0.15)" :
                    p.weightCategory?.toLowerCase() === "normal" ? "rgba(34,197,94,0.15)" :
                      "linear-gradient(145deg, rgba(229, 9, 20, 0.3), rgba(130, 0, 0, 0.15))",
                  color: p.weightCategory?.toLowerCase() === "low" ? "#f59e0b" :
                    p.weightCategory?.toLowerCase() === "normal" ? "#22c55e" :
                      "#fff",
                  border: `1px solid ${p.weightCategory?.toLowerCase() === "low" ? "rgba(245,158,11,0.3)" :
                    p.weightCategory?.toLowerCase() === "normal" ? "rgba(34,197,94,0.3)" :
                      "rgba(229,9,20,0.5)"}`,
                  letterSpacing: "1.5px", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "800", padding: "6px 16px", borderRadius: "6px",
                  boxShadow: p.weightCategory?.toLowerCase() !== "normal" ? "0 4px 10px rgba(229, 9, 20, 0.2)" : "none",
                  display: "inline-block"
                }}>
                  {getBadgeLabel(p.weightCategory)}
                </span>
              </div>

              {/* STAT GRID */}
              <div className="row g-3 mt-2">

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Age</span><b>{p.age}</b></div>
                </div>

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Gender</span><b>{p.gender}</b></div>
                </div>

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Height</span><b>{p.height} cm</b></div>
                </div>

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Weight</span><b>{p.weight} kg</b></div>
                </div>

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Activity</span><b>{p.activityLevel}</b></div>
                </div>

                <div className="col-6 col-md-4">
                  <div className="bmi-stat-sm"><span>Goal</span><b style={{ textTransform: "capitalize" }}>{p.goal.replace(/_/g, " ")}</b></div>
                </div>

                <div className="col-12 mt-2">
                  <div className="p-3 rounded text-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}>
                    <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>Food Preference</span>
                    <h6 className="text-white fw-bold mb-0 mt-2" style={{ textTransform: "capitalize" }}>{p.foodPreference}</h6>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* 🎨 SMALL + ANIMATED BMI UI */}
      {/* ===================== */}
      <style>{`
        .bmi-circle-sm {
          width:120px;
          height:120px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:auto;
          animation:pulse 2s infinite;
          transition: all 0.3s ease;
          background: rgba(0,0,0,0.5);
        }

        @keyframes pulse {
          0% { box-shadow:0 0 0 0 rgba(0,0,0,.3); }
          70% { box-shadow:0 0 0 15px rgba(0,0,0,0); }
          100% { box-shadow:0 0 0 0 rgba(0,0,0,0); }
        }

        .bmi-low { color:#fbbf24; border: 3px solid #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
        .bmi-normal { color:#22c55e; border: 3px solid #16a34a; box-shadow: 0 0 20px rgba(22, 163, 74, 0.4); }
        .bmi-high { color:#ef4444; border: 3px solid #dc2626; box-shadow: 0 0 20px rgba(220, 38, 38, 0.4); }

        .bmi-value-sm {
          font-size:32px;
          font-weight:900;
          line-height:1;
        }

        .bmi-label-sm {
          font-size:12px;
          letter-spacing:2px;
          color: #b3b3b3;
        }

        .bmi-stat-sm {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius:8px;
          padding:10px;
          text-align:center;
          height:100%;
        }

        .bmi-stat-sm span {
          display:block;
          font-size:11px;
          color:#b3b3b3;
          text-transform: uppercase;
        }

        .bmi-stat-sm b {
          font-size:14px;
          color:#ffffff;
        }
      `}</style>
    </div>
  );
}