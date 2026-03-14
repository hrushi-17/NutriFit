import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [p, setP] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
    foodPreference: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    api.get("/profile")
      .then(res => {
        if (res.data) setP(res.data);
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      });
  }, [navigate]);

  const save = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await api.post("/profile", p);
      setMsg("✅ Profile saved successfully! BMI = " + res.data.bmi);
      setTimeout(() => navigate("/dashboard/bmi"), 1500);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setMsg("❌ Something went wrong while saving profile");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="container-fluid py-4"
      style={{ minHeight: "calc(100vh - 56px)", background: "transparent" }}
    >
      <div className="d-flex justify-content-center">
        <div className="glass-panel w-100 p-0 overflow-hidden d-flex flex-column" style={{ maxWidth: "650px", background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)" }}>
          <div className="fw-bold px-4 py-3 text-white border-bottom" style={{ background: "rgba(229,9,20,0.15)", borderColor: "rgba(229,9,20,0.4)", letterSpacing: "2px", fontSize: "1rem", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <i className="fa-solid fa-user-gear text-danger"></i> Profile Settings
          </div>

          <div className="card-body p-4 p-md-5">

            {/* Message Display */}
            {msg && (
              <div className={`premium-alert mb-4 ${msg.startsWith("✅") ? "premium-alert-success" : "premium-alert-error"}`}>
                <i className={`fa-solid ${msg.startsWith("✅") ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
                {msg.replace("✅ ", "").replace("❌ ", "")}
              </div>
            )}

            <div className="row g-4">
              {/* Age & Gender */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Age</label>
                <input
                  type="number"
                  min="0"
                  className="form-control netflix-input border border-secondary"
                  placeholder="Age"
                  value={p.age || ""}
                  onChange={e => setP({ ...p, age: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Gender</label>
                <select
                  className="form-control netflix-input border border-secondary"
                  value={p.gender || ""}
                  onChange={e => setP({ ...p, gender: e.target.value })}
                >
                  <option value="">-- Select Gender --</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Height & Weight */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Height (cm)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control netflix-input border border-secondary"
                  placeholder="Height"
                  value={p.height || ""}
                  onChange={e => setP({ ...p, height: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control netflix-input border border-secondary"
                  placeholder="Weight"
                  value={p.weight || ""}
                  onChange={e => setP({ ...p, weight: e.target.value })}
                />
              </div>

              {/* Activity Level & Goal */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Activity Level</label>
                <select
                  className="form-control netflix-input border border-secondary"
                  value={p.activityLevel || ""}
                  onChange={e => setP({ ...p, activityLevel: e.target.value })}
                >
                  <option value="">-- Select Activity Level --</option>
                  <option value="Low">Low (Sedentary)</option>
                  <option value="Medium">Medium (Active)</option>
                  <option value="High">High (Very Active)</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-muted text-uppercase small">Goal</label>
                <select
                  className="form-control netflix-input border border-secondary"
                  value={p.goal || ""}
                  onChange={e => setP({ ...p, goal: e.target.value })}
                >
                  <option value="">-- Select Goal --</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Fitness">Stay Fit</option>
                </select>
              </div>

              {/* Food Preference */}
              <div className="col-12">
                <label className="form-label fw-semibold text-muted text-uppercase small">Food Preference</label>
                <select
                  className="form-control netflix-input border border-secondary"
                  value={p.foodPreference || ""}
                  onChange={e => setP({ ...p, foodPreference: e.target.value })}
                >
                  <option value="">-- Select Food Preference --</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="col-12 d-flex justify-content-center mt-4">
                <button
                  className="btn btn-netflix px-5 py-3 fw-bold fs-5 shadow-lg"
                  style={{ letterSpacing: "1px" }}
                  onClick={save}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  ) : (
                    <><i className="fa-solid fa-floppy-disk me-2"></i> Save Profile</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
