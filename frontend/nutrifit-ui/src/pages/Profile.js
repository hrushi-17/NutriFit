import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

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
    <div className="profile-container animate-fade-up">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Update Profile</h2>
          <p className="profile-subtitle">Customize your health tracking metrics</p>
        </div>

        <div className="profile-grid">
          {/* Age */}
          <div className="profile-input-group animate-fade-up delay-1">
            <label className="profile-label">Age</label>
            <input
              type="number"
              className="profile-input"
              placeholder="Enter your age"
              value={p.age || ""}
              onChange={e => setP({ ...p, age: e.target.value })}
            />
          </div>

          {/* Gender */}
          <div className="profile-input-group animate-fade-up delay-1">
            <label className="profile-label">Gender</label>
            <select
              className="profile-input"
              value={p.gender || ""}
              onChange={e => setP({ ...p, gender: e.target.value })}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Height */}
          <div className="profile-input-group animate-fade-up delay-2">
            <label className="profile-label">Height (cm)</label>
            <input
              type="number"
              className="profile-input"
              placeholder="Height in cm"
              value={p.height || ""}
              onChange={e => setP({ ...p, height: e.target.value })}
            />
          </div>

          {/* Weight */}
          <div className="profile-input-group animate-fade-up delay-2">
            <label className="profile-label">Weight (kg)</label>
            <input
              type="number"
              className="profile-input"
              placeholder="Weight in kg"
              value={p.weight || ""}
              onChange={e => setP({ ...p, weight: e.target.value })}
            />
          </div>

          {/* Activity Level */}
          <div className="profile-input-group animate-fade-up delay-3">
            <label className="profile-label">Activity Level</label>
            <select
              className="profile-input"
              value={p.activityLevel || ""}
              onChange={e => setP({ ...p, activityLevel: e.target.value })}
            >
              <option value="">-- Select Activity --</option>
              <option value="Low">Low (Sedentary)</option>
              <option value="Medium">Medium (Active)</option>
              <option value="High">High (Very Active)</option>
            </select>
          </div>

          {/* Target Goal */}
          <div className="profile-input-group animate-fade-up delay-3">
            <label className="profile-label">Target Goal</label>
            <select
              className="profile-input"
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
          <div className="profile-input-group animate-fade-up delay-3" style={{ gridColumn: "1 / -1" }}>
            <label className="profile-label">Food Preference</label>
            <select
              className="profile-input"
              value={p.foodPreference || ""}
              onChange={e => setP({ ...p, foodPreference: e.target.value })}
            >
              <option value="">-- Select Diet --</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="profile-submit-wrapper animate-fade-up delay-4">
            <button
              className="btn-netflix w-100 py-3 fs-5"
              onClick={save}
            >
              Save Profile Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
