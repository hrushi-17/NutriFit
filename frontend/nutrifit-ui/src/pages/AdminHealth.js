import api from "../api/axios";
import { useEffect, useState } from "react";
import "../styles/pages/AdminHealth.css";

export default function AdminHealth() {
  const [list, setList] = useState([]);
  const [hc, setHc] = useState({ name: "", description: "" });

  const load = () => {
    api.get("/admin/health").then(res => setList(res.data));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!hc.name) return alert("Name is required");
    await api.post("/admin/health", hc);
    setHc({ name: "", description: "" });
    load();
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this condition?")) return;
    await api.delete("/admin/health/" + id);
    load();
  };

  return (
    <div className="container mt-4 animate-fade-up">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="netflix-card p-4">
            <h4 className="fw-bolder mb-4 text-white text-uppercase" style={{ letterSpacing: "2px" }}>
              MANAGE HEALTH CONDITIONS
            </h4>

            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <input
                  type="text"
                  className="netflix-input form-control"
                  placeholder="Condition Name"
                  value={hc.name}
                  onChange={e => setHc({ ...hc, name: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="netflix-input form-control"
                  placeholder="Description"
                  value={hc.description}
                  onChange={e => setHc({ ...hc, description: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button className="btn-netflix w-100 h-100 fw-bold" onClick={save}>
                  ADD
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h6 className="text-muted fw-bold text-uppercase mb-3" style={{ letterSpacing: "1px" }}>Existing Conditions ({list.length})</h6>

              <div className="d-flex flex-column gap-2">
                {list.map((h, i) => (
                  <div
                    key={h.healthConditionId}
                    className="d-flex justify-content-between align-items-center p-3 animate-fade-up"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      animationDelay: `${i * 0.05}s`
                    }}
                  >
                    <div>
                      <h6 className="fw-bolder text-white mb-1" style={{ letterSpacing: "1px" }}>{h.name}</h6>
                      {h.description && <p className="text-muted small mb-0">{h.description}</p>}
                    </div>

                    <button
                      className="btn btn-sm px-3 fw-bold text-uppercase"
                      style={{ color: "var(--accent-red)", border: "1px solid var(--accent-red)", background: "transparent" }}
                      onClick={() => del(h.healthConditionId)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-red)"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-red)"; }}
                    >
                      DELETE
                    </button>
                  </div>
                ))}

                {list.length === 0 && (
                  <div className="text-muted text-center py-4 border border-secondary rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
                    No health conditions mapped yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}