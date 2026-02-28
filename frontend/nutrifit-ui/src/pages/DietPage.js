import api from "../api/axios";
import { useEffect, useState } from "react";

export default function DietPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/diet/daily-plan")
      .then(res => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mealOrder = {
    breakfast: 1,
    snack: 2,
    lunch: 3,
    snack2: 4,
    dinner: 5
  };

  if (loading) {
    return (
      <div className="text-center fw-bold mt-4 text-light">
        <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading your diet plan...
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-3 animate-fade-down">
      <div className="col-md-10">

        <div className="glass-panel neon-green border-0 p-3">
          <div className="fw-bold text-center fs-5 text-uppercase border-bottom border-success pb-3 mb-3 text-success" style={{ letterSpacing: "1px" }}>
            🥗 Your Daily Diet Plan
          </div>

          <div className="card-body px-0">

            {list.length === 0 && (
              <div className="p-3 w-100 rounded text-center fw-semibold mb-3" style={{ background: "rgba(0, 255, 0, 0.1)", border: "1px solid rgba(0, 255, 0, 0.3)", color: "#00ff00" }}>
                <i className="fa-solid fa-circle-info me-2"></i> No diet plan matched your profile yet.
                <br />
                Please update your profile and health conditions.
              </div>
            )}

            {[...list]
              .sort((a, b) => mealOrder[a.mealType] - mealOrder[b.mealType])
              .map((d, i) => (
                <div key={i} className="glass-panel mb-3 border-start border-4 border-success shadow-sm" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold text-success text-uppercase mb-0">
                        🍽 {d.mealType}
                      </h5>
                      <span className="badge bg-success text-white px-3 py-2 border border-light">
                        {d.calories} kcal
                      </span>
                    </div>

                    <h5 className="fw-bold text-light mb-3">{d.foodName}</h5>

                    <div className="row mt-2 g-2 small">
                      <div className="col-md-3 col-6">
                        <div className="bg-dark p-2 rounded border border-secondary text-center text-muted text-uppercase">
                          Protein <b className="d-block text-white fs-6 mt-1">{d.protein} g</b>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="bg-dark p-2 rounded border border-secondary text-center text-muted text-uppercase">
                          Carbs <b className="d-block text-white fs-6 mt-1">{d.carbs} g</b>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="bg-dark p-2 rounded border border-secondary text-center text-muted text-uppercase">
                          Fat <b className="d-block text-white fs-6 mt-1">{d.fat} g</b>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="bg-dark p-2 rounded border border-secondary text-center text-muted text-uppercase">
                          Sodium <b className="d-block text-white fs-6 mt-1">{d.sodiumContent} mg</b>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 small px-3 py-2 rounded text-info fw-semibold" style={{ background: "rgba(0, 255, 255, 0.1)", border: "1px solid rgba(0, 255, 255, 0.2)" }}>
                      <i className="fa-solid fa-droplet me-2"></i> GI Level: {d.glycemicIndex}
                    </div>

                  </div>
                </div>
              ))}

          </div>
        </div>

      </div>
    </div>
  );
}