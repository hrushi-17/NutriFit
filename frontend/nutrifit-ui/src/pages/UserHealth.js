import api from "../api/axios";
import { useEffect, useState } from "react";

export default function UserHealth() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get("/user/health/all").then(res => setList(res.data));
    api.get("/user/health").then(res => setSelected(res.data));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const save = async () => {
    await api.post("/user/health", selected);
    alert("✅ Health conditions saved successfully");
  };

  return (
    <div className="container py-3 animate-fade-down">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">

          <div className="glass-panel mb-2 overflow-hidden neon-red w-100 p-2">

            <div className="fw-bold text-uppercase p-2 text-center text-danger border-bottom border-danger mb-3 mx-2" style={{ letterSpacing: "1px" }}>
              ❤️ Select Your Health Conditions
            </div>

            <div className="card-body">

              <p className="text-light text-center mb-3">
                Choose conditions so we can generate safe workout & diet plans.
              </p>

              {/* HEALTH GRID */}
              <div className="row g-2 mb-3">

                {list.map(h => {
                  const isActive = selected.includes(h.healthConditionId);
                  return (
                    <div key={h.healthConditionId} className="col-md-4 col-6">
                      <div
                        className={`health-tile ${isActive ? "active" : ""}`}
                        onClick={() => toggle(h.healthConditionId)}
                      >
                        <div className="health-icon">
                          {isActive ? "✅" : "🩺"}
                        </div>
                        <div className="health-name">{h.name}</div>
                        <div className="health-check">
                          <input
                            type="checkbox"
                            checked={isActive}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* NO DISEASE UI */}
              {selected.length === 0 && (
                <div className="healthy-box-user mb-3">
                  💚 You have not selected any health condition
                </div>
              )}

              <button className="btn btn-netflix w-100 fw-semibold" onClick={save}>
                💾 Save Health Conditions
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* 🎨 CORPORATE HEALTH UI */}
      {/* ===================== */}
      <style>{`
        .health-tile {
          background: rgba(0, 0, 0, 0.4);
          border-radius:14px;
          padding:14px 10px;
          text-align:center;
          cursor:pointer;
          border:1px solid rgba(255,255,255,0.1);
          transition:.2s;
          height:100%;
          position:relative;
          color: white;
        }

        .health-tile:hover {
          transform:translateY(-2px);
          background: rgba(255, 255, 255, 0.05);
        }

        .health-tile.active {
          border-color:#e50914;
          background: rgba(229, 9, 20, 0.15);
          box-shadow: 0 0 15px rgba(229, 9, 20, 0.3);
        }

        .health-icon {
          font-size:28px;
          margin-bottom:6px;
        }

        .health-name {
          font-weight:700;
          color: #e5e5e5;
          font-size:14px;
        }

        .health-tile.active .health-name {
          color: white;
        }

        .health-check {
          position:absolute;
          top:8px;
          right:10px;
        }

        .health-check input {
          accent-color:#e50914;
          transform:scale(1.1);
        }

        .healthy-box-user {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius:12px;
          padding:10px;
          text-align:center;
          font-weight:600;
          color: #10b981;
        }
      `}</style>
    </div>
  );
}