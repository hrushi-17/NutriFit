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

  return (
    <div
      className="container-fluid py-5 animate-fade-up"
      style={{ minHeight: "calc(100vh - 76px)", background: "var(--bg-dark)", color: "white" }}
    >
      <div className="d-flex justify-content-center">
        <div
          className="premium-card p-4 p-md-5 w-100"
          style={{
            maxWidth: "700px",
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}
        >
          <div className="text-center mb-5 border-bottom border-secondary pb-4">
            <h2 className="fw-bolder text-white" style={{ letterSpacing: "1px" }}>
              <span style={{ color: "var(--accent-blue)" }}>YOUR</span> PROFILE
            </h2>
            <p className="text-muted fw-semibold mb-0">Customize your health tracking metrics</p>
          </div>

          <div className="row g-4">
            {/* Age & Gender */}
            <div className="col-12 col-md-6 animate-fade-up delay-1">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Age</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-calendar"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-start-0"
                  placeholder="Enter your age"
                  value={p.age || ""}
                  onChange={e => setP({ ...p, age: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 animate-fade-up delay-1">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Gender</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-venus-mars"></i>
                </span>
                <select
                  className="form-control border-start-0"
                  value={p.gender || ""}
                  onChange={e => setP({ ...p, gender: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                >
                  <option value="" style={{ color: "black" }}>-- Select Gender --</option>
                  <option style={{ color: "black" }}>Male</option>
                  <option style={{ color: "black" }}>Female</option>
                  <option style={{ color: "black" }}>Other</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="col-12 col-md-6 animate-fade-up delay-2">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Height (cm)</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-ruler-vertical"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-start-0"
                  placeholder="Height in cm"
                  value={p.height || ""}
                  onChange={e => setP({ ...p, height: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 animate-fade-up delay-2">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Weight (kg)</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-weight-scale"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-start-0"
                  placeholder="Weight in kg"
                  value={p.weight || ""}
                  onChange={e => setP({ ...p, weight: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                />
              </div>
            </div>

            {/* Activity Level & Goal */}
            <div className="col-12 col-md-6 animate-fade-up delay-3">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Activity Level</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-person-running"></i>
                </span>
                <select
                  className="form-control border-start-0"
                  value={p.activityLevel || ""}
                  onChange={e => setP({ ...p, activityLevel: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                >
                  <option value="" style={{ color: "black" }}>-- Select Activity --</option>
                  <option value="Low" style={{ color: "black" }}>Low (Sedentary)</option>
                  <option value="Medium" style={{ color: "black" }}>Medium (Active)</option>
                  <option value="High" style={{ color: "black" }}>High (Very Active)</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 animate-fade-up delay-3">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Target Goal</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-bullseye"></i>
                </span>
                <select
                  className="form-control border-start-0"
                  value={p.goal || ""}
                  onChange={e => setP({ ...p, goal: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                >
                  <option value="" style={{ color: "black" }}>-- Select Goal --</option>
                  <option value="Weight Loss" style={{ color: "black" }}>Weight Loss</option>
                  <option value="Muscle Gain" style={{ color: "black" }}>Muscle Gain</option>
                  <option value="Fitness" style={{ color: "black" }}>Stay Fit</option>
                </select>
              </div>
            </div>

            {/* Food Preference */}
            <div className="col-12 animate-fade-up delay-3">
              <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Food Preference</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-leaf"></i>
                </span>
                <select
                  className="form-control border-start-0"
                  value={p.foodPreference || ""}
                  onChange={e => setP({ ...p, foodPreference: e.target.value })}
                  style={{ background: "transparent", borderColor: "var(--border-light)", color: "white" }}
                >
                  <option value="" style={{ color: "black" }}>-- Select Diet --</option>
                  <option value="Vegetarian" style={{ color: "black" }}>Vegetarian</option>
                  <option value="Non-Vegetarian" style={{ color: "black" }}>Non-Vegetarian</option>
                  <option value="Vegan" style={{ color: "black" }}>Vegan</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="col-12 d-flex justify-content-center mt-5 animate-fade-up delay-4">
              <button
                className="btn-health w-100 py-3 fs-5 d-flex align-items-center justify-content-center"
                onClick={save}
              >
                <i className="fa-solid fa-floppy-disk me-2"></i> Save Profile Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
