import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Chart from "chart.js/auto";
import "../styles/pages/Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const loadUsers = useCallback(async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data || []);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") navigate("/login");
    else loadUsers();
  }, [navigate, loadUsers]);

  const loadDetails = async (id) => {
    setActiveTab(id);
    const res = await api.get("/admin/users/" + id);
    setData(res.data);

    setTimeout(() => {
      drawChart(res.data?.progressHistory || []);
    }, 200);
  };

  const drawChart = (history) => {
    if (!history || history.length === 0) return;

    const labels = history.map(x => {
      const date = new Date(x.date);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const weights = history.map(x => x.weight);
    const bmis = history.map(x => x.bmi);

    if (chart) chart.destroy();

    const ctx = document.getElementById("adminProgressChart");
    if (!ctx) return;

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            borderColor: "#00ffff", // Neon Sky Blue
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            tension: 0.4,
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: "#00ffff",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00ffff",
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: "BMI",
            data: bmis,
            borderColor: "#ff3366", // Reddish Pink
            backgroundColor: "transparent",
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 3,
            pointBackgroundColor: "#ff3366",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#ff3366",
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#a3a3a3" } },
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#a3a3a3" } }
        },
        plugins: {
          legend: { labels: { color: "#fff" } }
        }
      }
    });

    setChart(newChart);
  };



  const noDisease = (data?.healthIssues || []).length === 0;

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all related data?")) return;

    try {
      const res = await api({
        method: "delete",
        url: "/admin/users/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log("Delete response:", res);
      alert("User deleted successfully!");
      setData(null);
      loadUsers();
    } catch (error) {
      console.error("Delete error:", error.response || error);
      alert("Failed to delete user: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-container animate-fade-up">

      <h4 className="admin-header">
        <span>Admin</span> Dashboard
      </h4>

      <div className="admin-grid">

        {/* USERS SIDEBAR */}
        <div className="admin-card">
          <div className="admin-card-header">Users Directory</div>
          <div className="admin-card-body users-sidebar">
            {users.map(u => (
              <div
                key={u.userId}
                className={`user-tile ${activeTab === u.userId ? "active" : ""}`}
                onClick={() => loadDetails(u.userId)}
              >
                <div className="user-tile-name">{u.name}</div>
                <div className="user-tile-email">{u.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DASHBOARD */}
        <div>
          {!data && <div className="alert mt-2" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}>Select a user to view full corporate dashboard</div>}

          {data && (
            <div className="animate-fade-up">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: 800, letterSpacing: "1px", margin: 0 }}>USER DATA SUMMARY</h5>
                <button
                  className="btn btn-outline-danger btn-sm"
                  style={{ fontWeight: 700 }}
                  onClick={() => deleteUser(data.user.userId)}
                >
                  DELETE USER
                </button>
              </div>

              <div className="info-cards-grid">

                {/* PROFILE CARD */}
                <div className="admin-card">
                  <div className="admin-card-header">User Profile</div>
                  <div className="admin-card-body p-2">
                    <div className="admin-profile-top">
                      <div className="admin-avatar">{data.user?.name?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem" }}>{data.user?.name}</div>
                        <div style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>{data.user?.email}</div>
                      </div>
                    </div>
                    <div className="admin-stats-grid">
                      <div className="admin-stat-box">
                        <div className="admin-stat-label">Age</div>
                        <div className="admin-stat-value">{data.profile?.age || "N/A"}</div>
                      </div>
                      <div className="admin-stat-box">
                        <div className="admin-stat-label">BMI</div>
                        <div className="admin-stat-value">{data.profile?.bmi || "N/A"}</div>
                      </div>
                      <div className="admin-stat-box">
                        <div className="admin-stat-label">Wt (kg)</div>
                        <div className="admin-stat-value">{data.profile?.weight || "N/A"}</div>
                      </div>
                      <div className="admin-stat-box">
                        <div className="admin-stat-label">Ht (cm)</div>
                        <div className="admin-stat-value">{data.profile?.height || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HEALTH CONDITIONS CARD */}
                <div className="admin-card">
                  <div className="admin-card-header">Health Conditions</div>
                  <div className="admin-card-body d-flex align-items-center justify-content-center p-2">
                    {noDisease ? (
                      <div className="health-badge-ok w-100">
                        CLEAN BILL OF HEALTH<br />
                        <span style={{ fontSize: "0.75rem", fontWeight: "normal", opacity: 0.8 }}>No disease detected</span>
                      </div>
                    ) : (
                      <div className="w-100 text-center">
                        {data.healthIssues.map((h, i) => (
                          <span key={i} className="disease-chip">{h.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIVE GOAL CARD */}
                <div className="admin-card">
                  <div className="admin-card-header">Goal Trajectory</div>
                  <div className="admin-card-body p-2">
                    {data.activeGoal ? (
                      <div className="admin-stats-grid mb-2">
                        <div className="admin-stat-box" style={{ gridColumn: "1 / -1" }}>
                          <div className="admin-stat-label">Objective</div>
                          <div className="admin-stat-value" style={{ color: "var(--accent-red)" }}>{data.activeGoal.goalType}</div>
                        </div>
                        <div className="admin-stat-box">
                          <div className="admin-stat-label">Target</div>
                          <div className="admin-stat-value">{data.activeGoal.targetValue}</div>
                        </div>
                        <div className="admin-stat-box">
                          <div className="admin-stat-label">Status</div>
                          <div className="admin-stat-value" style={{ color: data.activeGoal.status === "completed" ? "#10b981" : "var(--accent-warning)" }}>
                            {data.activeGoal.status}
                          </div>
                        </div>
                      </div>
                    ) : <div className="text-center text-muted mt-3">No Active Goal</div>}
                  </div>
                </div>

                {/* CHART MINI CARD */}
                <div className="admin-card">
                  <div className="admin-card-header">Progress Chart</div>
                  <div className="admin-card-body p-2" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="admin-chart-container">
                      <canvas id="adminProgressChart"></canvas>
                    </div>
                  </div>
                </div>

              </div>

              <div className="row g-3">
                {/* WORKOUT */}
                <div className="col-12 col-md-6">
                  <div className="admin-card flex-fill h-100">
                    <div className="admin-card-header">Workout Directive</div>
                    <div className="netflix-table-wrapper h-100">
                      <table className="netflix-table">
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Routine</th>
                            <th>Lvl</th>
                            <th>Min</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data.workoutPlan || []).map((w, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: "700" }}>{w.dayName}</td>
                              <td>{w.workoutName} <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>{w.workoutType}</span></td>
                              <td>
                                <span style={{
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  background: "rgba(255,255,255,0.1)",
                                  fontSize: "0.75rem",
                                  fontWeight: "600"
                                }}>{w.intensity}</span>
                              </td>
                              <td style={{ color: "var(--accent-blue)", fontWeight: "bold" }}>{w.durationMinutes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* DIET */}
                <div className="col-12 col-md-6">
                  <div className="admin-card flex-fill h-100">
                    <div className="admin-card-header">Diet Protocol</div>
                    <div className="netflix-table-wrapper h-100">
                      <table className="netflix-table">
                        <thead>
                          <tr>
                            <th>Meal Segment</th>
                            <th>Nutrition Source</th>
                            <th>kCal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data.dietPlan || []).map((d, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: "700", textTransform: "capitalize" }}>{d.mealType}</td>
                              <td>
                                {d.foodName}
                                <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                  P: {d.protein} | C: {d.carbs} | F: {d.fat}
                                </div>
                              </td>
                              <td style={{ color: "#10b981", fontWeight: "bold" }}>{d.calories}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
