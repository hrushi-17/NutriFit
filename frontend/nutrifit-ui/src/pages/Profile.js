import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

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
      const res = await api.post("/profile", p);
      alert("✅ Profile saved successfully.\nBMI = " + res.data.bmi);
      navigate("/dashboard/bmi");
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("❌ Something went wrong while saving profile");
      }
    }
  };



  return (
    <div
      className="container-fluid py-4"
      style={{ minHeight: "calc(100vh - 56px)", background: "transparent" }}
    >
      <div className="d-flex justify-content-center">
        <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: "650px", borderTop: "3px solid #e50914" }}>
          <h3 className="text-center mb-4 fw-bold text-uppercase border-bottom pb-3" style={{ color: "#e50914", letterSpacing: "1px", borderColor: "rgba(229, 9, 20, 0.3)" }}>
            Profile Settings
          </h3>

          <div className="row g-4">
            {/* Age & Gender */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-muted text-uppercase small">Age</label>
              <input
                type="number"
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

            {/* Action Buttons */}
            <div className="col-12 d-flex justify-content-center mt-4">
              <button
                className="btn btn-netflix px-5 py-3 fw-bold fs-5 shadow-lg"
                style={{ letterSpacing: "1px" }}
                onClick={save}
              >
                <i className="fa-solid fa-floppy-disk me-2"></i> Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
