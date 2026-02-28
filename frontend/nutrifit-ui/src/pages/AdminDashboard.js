import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Chart from "chart.js/auto";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(null);

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
            borderColor: "#00ffff",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            pointBackgroundColor: "#00ffff",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00ffff",
            pointRadius: 4,
            tension: 0.4,
            borderWidth: 3,
            fill: true
          },
          {
            label: "BMI",
            data: bmis,
            borderColor: "#ff3366",
            backgroundColor: "rgba(255, 51, 102, 0.1)",
            pointBackgroundColor: "#ff3366",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#ff3366",
            pointRadius: 4,
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 2
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    setChart(newChart);
  };

  const latest = data?.progressHistory?.length
    ? data.progressHistory[data.progressHistory.length - 1]
    : null;

  const noDisease = (data?.healthIssues || []).length === 0;

  // ✅ UPDATED: Delete User function (fixed 405 issue)
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all related data?")) return;

    try {
      // Using full Axios config ensures headers are sent correctly
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
      setData(null); // clear selected user
      loadUsers();   // reload users list
    } catch (error) {
      console.error("Delete error:", error.response || error);
      alert("Failed to delete user: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container-fluid px-3 py-4" style={{ background: "transparent", minHeight: "100vh" }}>

      <h4 className="fw-bold mb-4" style={{ color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>🛡 NutriFit Admin Dashboard</h4>

      <div className="row g-2 align-items-stretch">

        {/* USERS */}
        <div className="col-xl-2 col-md-3 d-flex">
          <div className="glass-panel w-100 d-flex flex-column h-100 p-0" style={{ overflow: "hidden" }}>
            <div className="fw-bold text-uppercase text-white px-3 py-2 border-bottom" style={{ letterSpacing: "2px", fontSize: "0.75rem", background: "rgba(229,9,20,0.1)", borderColor: "rgba(229,9,20,0.3)" }}>Users</div>
            <div style={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
              {users.map(u => (
                <div
                  key={u.userId}
                  onClick={() => loadDetails(u.userId)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    transition: "background 0.2s",
                    background: "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(229,9,20,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div
                    style={{
                      width: "32px", height: "32px",
                      background: "#e50914",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#fff",
                      marginBottom: "6px",
                    }}
                  >
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="fw-semibold text-white" style={{ fontSize: "0.85rem", lineHeight: 1.2 }}>{u.name}</div>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>{u.email}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="col-xl-10 col-md-9">

          {!data && <div className="alert alert-info">Select a user to view full dashboard</div>}

          {data && (
            <>
              {/* ================= DELETE USER BUTTON ================= */}
              <div className="mb-2 text-end">
                <button
                  className="btn btn-danger"
                  onClick={() => deleteUser(data.user.userId)}
                >
                  Delete User
                </button>
              </div>

              <div className="row g-2 mb-2 align-items-stretch">

                {/* PROFILE */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3">
                    <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary">
                      <div className="bg-primary text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded" style={{ width: "50px", height: "50px", fontSize: "1.5rem", fontWeight: "bold" }}>
                        {data.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-bold fs-5 text-light">{data.user?.name}</div>
                        <small className="text-muted">{data.user?.email}</small>
                      </div>
                    </div>

                    <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className="bg-dark p-2 rounded text-center border border-secondary">
                        <span className="d-block text-muted small text-uppercase">Age</span>
                        <b className="text-light">{data.profile?.age}</b>
                      </div>
                      <div className="bg-dark p-2 rounded text-center border border-secondary">
                        <span className="d-block text-muted small text-uppercase">Height</span>
                        <b className="text-light">{data.profile?.height} cm</b>
                      </div>
                      <div className="bg-dark p-2 rounded text-center border border-secondary">
                        <span className="d-block text-muted small text-uppercase">Weight</span>
                        <b className="text-light">{data.profile?.weight} kg</b>
                      </div>
                      <div className="bg-dark p-2 rounded text-center border border-secondary">
                        <span className="d-block text-muted small text-uppercase">BMI</span>
                        <b className="text-light">{data.profile?.bmi}</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HEALTH */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3 d-flex flex-column">
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom text-white" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", borderColor: "rgba(255,255,255,0.1)" }}>
                      Health Conditions
                    </div>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column text-center">

                      {noDisease ? (
                        <div className="p-3 w-100 rounded" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <div className="fw-bold fs-5 text-white">Healthy</div>
                          <small className="text-muted">No conditions recorded</small>
                        </div>
                      ) : (
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          {data.healthIssues.map((h, i) => (
                            <div key={i} className="px-3 py-2 rounded fw-bold" style={{ background: "rgba(229, 9, 20, 0.2)", border: "1px solid rgba(229, 9, 20, 0.5)", color: "#ff3333" }}>
                              🩺 {h.name}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* GOAL */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3 h-100 d-flex flex-column" style={{ borderTop: "3px solid #f59e0b" }}>
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom border-warning text-warning">
                      🎯 Goal & Status
                    </div>
                    <div className="small flex-grow-1 d-flex flex-column justify-content-between">

                      <div className="mb-3 bg-dark p-2 rounded border border-secondary">
                        <div className="text-muted text-uppercase fw-bold mb-2 border-bottom pb-1 border-secondary">Current Goal</div>

                        {data.activeGoal ? (
                          <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <div><span className="text-muted d-block">Type</span><b className="text-light">{data.activeGoal.goalType}</b></div>
                            <div><span className="text-muted d-block">Target</span><b className="text-light">{data.activeGoal.targetValue}</b></div>

                            <div className="col-span-2 mt-2 pt-2 border-top border-secondary text-center">
                              <span className="text-muted me-2">Status:</span>
                              <b className={
                                data.activeGoal.status === "completed"
                                  ? "text-success text-uppercase"
                                  : "text-warning text-uppercase"
                              }>
                                {data.activeGoal.status}
                              </b>
                            </div>
                          </div>
                        ) : <span className="text-light d-block text-center py-2">No goal</span>}
                      </div>

                      <div className="bg-dark p-2 rounded border border-secondary">
                        <div className="text-muted text-uppercase fw-bold mb-2 border-bottom pb-1 border-secondary">Body Status</div>
                        {latest && (
                          <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <div><span className="text-muted d-block">Weight</span><b className="text-light">{latest.weight} kg</b></div>
                            <div><span className="text-muted d-block">BMI</span><b className="text-light">{latest.bmi}</b></div>
                            <div><span className="text-muted d-block">Category</span><b className="text-light">{latest.weightCategory}</b></div>
                            <div><span className="text-muted d-block">Date</span><b className="text-light">{latest.date.split("T")[0]}</b></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRAPH */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3 progress-animate" style={{ borderTop: "3px solid #00ff00" }}>
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom" style={{ color: "#00ff00", borderColor: "rgba(0,255,0,0.3)" }}>
                      📈 Progress
                    </div>
                    <div style={{ height: 200, width: "100%" }}>
                      <canvas id="adminProgressChart"></canvas>
                    </div>
                  </div>
                </div>

              </div>

              {/* WORKOUT */}
              <div className="glass-panel w-100 mb-3 overflow-hidden">
                <div className="fw-bold text-uppercase p-3 border-bottom" style={{ background: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>🏋️ Workout Plan</div>
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm m-0 border-0" style={{ background: "transparent" }}>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Workout</th>
                        <th>Type</th>
                        <th>Intensity</th>
                        <th>Minutes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.workoutPlan || []).map((w, i) => (
                        <tr key={i}>
                          <td className="fw-bold">{w.dayName}</td>
                          <td>{w.workoutName}</td>
                          <td>{w.workoutType}</td>
                          <td><span className="badge bg-info">{w.intensity}</span></td>
                          <td>{w.durationMinutes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DIET */}
              <div className="glass-panel w-100 overflow-hidden">
                <div className="fw-bold text-uppercase p-3 border-bottom" style={{ background: "rgba(0,0,0,0.5)", color: "#f59e0b", letterSpacing: "1px" }}>🥗 Diet Plan</div>
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm m-0 border-0" style={{ background: "transparent" }}>
                    <thead>
                      <tr>
                        <th>Meal</th>
                        <th>Food</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Carbs</th>
                        <th>Fat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.dietPlan || []).map((d, i) => (
                        <tr key={i}>
                          <td className="fw-bold text-capitalize">{d.mealType}</td>
                          <td>{d.foodName}</td>
                          <td>{d.calories}</td>
                          <td>{d.protein}</td>
                          <td>{d.carbs}</td>
                          <td>{d.fat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .user-scroll::-webkit-scrollbar { width: 4px; }
        .user-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .progress-animate { animation: fadeUp .6s ease; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .table-dark {
          --bs-table-bg: transparent;
          color: white;
        }
        .table-dark th {
          background: rgba(0, 0, 0, 0.6);
          color: #b3b3b3;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .table-dark td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: #e5e5e5;
        }
        .table-hover>tbody>tr:hover>* {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
      `}</style>

    </div>
  );
}
