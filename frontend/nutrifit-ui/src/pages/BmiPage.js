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

          <div className="glass-panel w-100 p-1">

            {/* HEADER */}
            <div className="fw-bold text-uppercase p-2 text-center text-white border-bottom mb-3 mx-2" style={{ letterSpacing: "2px", borderColor: "rgba(229,9,20,0.3)" }}>
              BMI REPORT
            </div>

            <div className="card-body py-3">

              {/* BMI CIRCLE */}
              <div className="text-center mb-2">
                <div className={`bmi-circle-sm ${bmiColor}`}>
                  <div>
                    <div className="bmi-value-sm">{animatedBmi.toFixed(2)}</div>
                    <div className="bmi-label-sm">BMI</div>
                  </div>
                </div>

                <span className={`badge mt-2 px-2 py-1 ${p.weightCategory?.toLowerCase() === "low"
                  ? "bg-warning"
                  : p.weightCategory?.toLowerCase() === "normal"
                    ? "bg-success"
                    : "bg-danger"
                  }`}>
                  {getBadgeLabel(p.weightCategory)}
                </span>
              </div>

              {/* STAT GRID */}
              <div className="row g-2">

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
                  <div className="bmi-stat-sm"><span>Goal</span><b>{p.goal}</b></div>
                </div>

                <div className="col-12 mt-3">
                  <div className="bg-dark p-2 rounded text-center border border-secondary text-light"><span>Food Preference</span><b className="ms-2">{p.foodPreference}</b></div>
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