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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ minHeight: "calc(100vh - 56px)", background: "transparent" }}
    >
      <div className="d-flex justify-content-center">
        <div className="card netflix-card shadow-lg p-4 p-md-5 rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h3 className="text-center mb-4" style={{ fontWeight: "600", color: "#fff" }}>
            User Profile
          </h3>

          <div className="row g-3">
            {/* Age & Gender */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Age</label>
              <input
                type="number"
                className="form-control netflix-input"
                placeholder="Age"
                value={p.age || ""}
                onChange={e => setP({ ...p, age: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Gender</label>
              <select
                className="form-control netflix-input"
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
              <label className="form-label fw-semibold">Height (cm)</label>
              <input
                type="number"
                className="form-control netflix-input"
                placeholder="Height"
                value={p.height || ""}
                onChange={e => setP({ ...p, height: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Weight (kg)</label>
              <input
                type="number"
                className="form-control netflix-input"
                placeholder="Weight"
                value={p.weight || ""}
                onChange={e => setP({ ...p, weight: e.target.value })}
              />
            </div>

            {/* Activity Level & Goal */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Activity Level</label>
              <select
                className="form-control netflix-input"
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
              <label className="form-label fw-semibold">Goal</label>
              <select
                className="form-control netflix-input"
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
              <label className="form-label fw-semibold">Food Preference</label>
              <select
                className="form-control netflix-input"
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
            <div className="col-12 d-flex flex-column flex-md-row justify-content-center mt-4 gap-3">
              <button
                className="btn btn-netflix px-4 py-2 fw-bold"
                onClick={save}
              >
                <i className="fa-solid fa-floppy-disk me-2"></i> Save Profile
              </button>

              <button
                className="btn btn-outline-glass px-4 py-2 fw-bold text-danger border-danger"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e50914"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#dc3545"; }}
                onClick={logout}
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
