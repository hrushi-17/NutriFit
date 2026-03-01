import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Chart from "chart.js/auto";
import "../styles/pages/Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

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

    // Destroy existing chart instance using ref (avoids stale closure bug)
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = document.getElementById("adminProgressChart");
    if (!ctx) return;

    // Fallback: destroy any orphaned chart on this canvas
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#3b82f6",
            pointRadius: 4,
            tension: 0.4,
            borderWidth: 3,
            fill: true
          },
          {
            label: "BMI",
            data: bmis,
            borderColor: "#e50914",
            backgroundColor: "rgba(229, 9, 20, 0.1)",
            pointBackgroundColor: "#e50914",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#e50914",
            pointRadius: 4,
            tension: 0.4,
            borderDash: [6, 6],
            borderWidth: 2
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    chartRef.current = newChart;
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
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    transition: "background 0.2s",
                    background: "transparent",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(229,9,20,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div
                    style={{
                      width: "38px", height: "38px",
                      background: "#e50914",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#fff",
                      marginBottom: "0",
                      flexShrink: 0,
                    }}
                  >
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.85rem", lineHeight: 1.2 }}>{u.name}</div>
                    <small style={{ color: "#a3a3a3", fontSize: "0.7rem" }}>{u.email}</small>
                  </div>
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
              <div className="mb-3 text-end">
                <button
                  className="btn btn-netflix shadow-lg px-4 fw-bold"
                  onClick={() => deleteUser(data.user.userId)}
                >
                  <i className="fa-solid fa-trash me-2"></i> Delete User
                </button>
              </div>

              <div className="row g-2 mb-2 align-items-stretch">

                {/* PROFILE */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3">
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom text-white" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", borderColor: "rgba(255,255,255,0.1)" }}>
                      User Profile
                    </div>
                    <div className="admin-netflix-card p-3 mb-3 d-flex align-items-center gap-3" style={{ background: "linear-gradient(145deg, rgba(229, 9, 20, 0.15), rgba(0, 0, 0, 0.6))", border: "1px solid rgba(229, 9, 20, 0.2)", borderRadius: "8px" }}>
                      <div className="text-white flex-shrink-0 d-flex justify-content-center align-items-center" style={{ background: "linear-gradient(145deg, #e50914, #8b0000)", width: "48px", height: "48px", fontSize: "1.4rem", fontWeight: "900", borderRadius: "8px", boxShadow: "0 4px 10px rgba(229, 9, 20, 0.3)" }}>
                        {data.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold fs-5 text-white lh-1 mb-1">{data.user?.name}</div>
                        <small style={{ color: "#a3a3a3", fontSize: "0.8rem" }}>{data.user?.email}</small>
                      </div>
                    </div>

                    <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className="admin-info-item">
                        <span className="admin-info-label">Age</span>
                        <b className="admin-info-value">{data.profile?.age}</b>
                      </div>
                      <div className="admin-info-item">
                        <span className="admin-info-label">Height</span>
                        <b className="admin-info-value">{data.profile?.height} cm</b>
                      </div>
                      <div className="admin-info-item">
                        <span className="admin-info-label">Weight</span>
                        <b className="admin-info-value">{data.profile?.weight} kg</b>
                      </div>
                      <div className="admin-info-item">
                        <span className="admin-info-label">BMI</span>
                        <b className="admin-info-value">{data.profile?.bmi}</b>
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
                        <div className="admin-netflix-card p-4 text-center d-flex flex-column justify-content-center h-100 mb-0 w-100" style={{ background: "linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(0, 0, 0, 0.6))", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                          <div className="fw-bold fs-4 text-white mb-2"><i className="fa-solid fa-heart-circle-check text-success me-2"></i> Healthy</div>
                          <div style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>No conditions recorded</div>
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
                  <div className="glass-panel w-100 p-3 h-100 d-flex flex-column">
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom text-white" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", borderColor: "rgba(255,255,255,0.1)" }}>
                      Goal & Status
                    </div>
                    <div className="small flex-grow-1 d-flex flex-column justify-content-between">

                      <div className="admin-netflix-card admin-netflix-card-sm d-flex flex-column" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.2)" }}>
                        <div className={`admin-netflix-card-glow ${(data.activeGoal?.status === "completed" ||
                          (data.activeGoal && latest &&
                            ((() => {
                              const gType = (data.activeGoal.goalType || "").toLowerCase().replace(/_/g, " ");
                              const cW = parseFloat(latest.weight);
                              const tW = parseFloat(data.activeGoal.targetValue);
                              return (gType.includes("weight loss") && cW <= tW) || (gType.includes("muscle gain") && cW >= tW);
                            })())
                          )
                        ) ? "success" : ""}`}></div>

                        <div className="d-flex justify-content-between align-items-center mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>
                          <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Active Target</span>
                          {data.activeGoal && (
                            (() => {
                              let dynamicStatus = data.activeGoal.status;
                              if (latest && dynamicStatus !== "completed") {
                                const cW = parseFloat(latest.weight);
                                const tW = parseFloat(data.activeGoal.targetValue);
                                const gType = (data.activeGoal.goalType || "").toLowerCase().replace(/_/g, " ");
                                if (gType.includes("weight loss") && cW <= tW) dynamicStatus = "completed";
                                if (gType.includes("muscle gain") && cW >= tW) dynamicStatus = "completed";
                              }
                              return (
                                <span className="badge" style={{
                                  background: dynamicStatus === "completed" ? "rgba(34,197,94,0.15)" : "linear-gradient(145deg, rgba(229, 9, 20, 0.3), rgba(130, 0, 0, 0.15))",
                                  color: dynamicStatus === "completed" ? "#22c55e" : "#fff",
                                  border: `1px solid ${dynamicStatus === "completed" ? "rgba(34,197,94,0.3)" : "rgba(229,9,20,0.5)"}`,
                                  letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.5rem",
                                  boxShadow: dynamicStatus !== "completed" ? "0 4px 10px rgba(229, 9, 20, 0.2)" : "none"
                                }}>
                                  {dynamicStatus}
                                </span>
                              );
                            })()
                          )}
                        </div>

                        {data.activeGoal ? (
                          <div className="d-flex align-items-center gap-2 flex-grow-1">
                            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(145deg, rgba(229, 9, 20, 0.25), rgba(150, 0, 0, 0.1))", border: "1px solid rgba(229, 9, 20, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#e50914", boxShadow: "0 2px 8px rgba(229, 9, 20, 0.2)" }}>
                              {data.activeGoal.goalType.toLowerCase().includes('weight') ? <i className="fa-solid fa-weight-scale"></i> : <i className="fa-solid fa-person-running"></i>}
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="text-white fw-bold lh-1 mb-1" style={{ fontSize: "0.85rem", textTransform: "capitalize" }}>{data.activeGoal.goalType}</div>
                              <div style={{ color: "#a3a3a3", fontSize: "0.6rem", fontWeight: "600", letterSpacing: "0.5px" }}>TARGET: <span style={{ color: "#e50914", fontWeight: "800", fontSize: "0.75rem" }}>{data.activeGoal.targetValue}</span></div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 rounded flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                            <i className="fa-solid fa-circle-exclamation mb-1" style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.2)" }}></i>
                            <span className="text-white d-block" style={{ fontSize: "0.75rem", color: "#888", fontWeight: "500" }}>No target set</span>
                          </div>
                        )}
                      </div>

                      <div className="admin-netflix-card admin-netflix-card-sm mb-0 d-flex flex-column" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", border: "1px solid rgba(229,9,20,0.2)" }}>
                        <div className="admin-netflix-card-glow"></div>
                        <div className="d-flex justify-content-between align-items-center mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>
                          <span style={{ color: "#a3a3a3", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Body Status</span>
                        </div>

                        {latest ? (
                          <div className="d-flex align-items-center gap-2 flex-grow-1">
                            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(145deg, rgba(229, 9, 20, 0.25), rgba(150, 0, 0, 0.1))", border: "1px solid rgba(229, 9, 20, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#e50914", boxShadow: "0 2px 8px rgba(229, 9, 20, 0.2)" }}>
                              <i className="fa-solid fa-child-reaching"></i>
                            </div>
                            <div className="d-flex flex-grow-1 gap-2">
                              <div className="d-flex flex-column justify-content-center" style={{ flex: 1, gap: "4px" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span style={{ color: "#a3a3a3", fontSize: "0.55rem", fontWeight: "700", letterSpacing: "0.5px" }}>WEIGHT</span>
                                  <span style={{ color: "#fff", fontWeight: "800", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{latest.weight} <span style={{ fontSize: "0.55rem", color: "#888" }}>kg</span></span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span style={{ color: "#a3a3a3", fontSize: "0.55rem", fontWeight: "700", letterSpacing: "0.5px" }}>BMI</span>
                                  <span style={{ color: "#e50914", fontWeight: "900", fontSize: "0.75rem" }}>{latest.bmi}</span>
                                </div>
                              </div>
                              <div style={{ width: "1px", background: "rgba(255,255,255,0.05)", margin: "2px 0" }}></div>
                              <div className="d-flex flex-column justify-content-center" style={{ flex: 1, gap: "4px" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span style={{ color: "#a3a3a3", fontSize: "0.55rem", fontWeight: "700", letterSpacing: "0.5px" }}>TYPE</span>
                                  <span style={{ color: "#fff", fontWeight: "800", fontSize: "0.65rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "45px", textTransform: "capitalize" }} title={latest.weightCategory}>{latest.weightCategory}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span style={{ color: "#a3a3a3", fontSize: "0.55rem", fontWeight: "700", letterSpacing: "0.5px" }}>DATE</span>
                                  <span style={{ color: "#fff", fontWeight: "800", fontSize: "0.55rem", letterSpacing: "0.5px" }}>{latest.date.split("T")[0]}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 rounded flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                            <span className="text-white d-block" style={{ fontSize: "0.75rem", color: "#888", fontWeight: "500" }}>No status data</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRAPH */}
                <div className="col-md-3 d-flex">
                  <div className="glass-panel w-100 p-3 progress-animate">
                    <div className="fw-bold text-uppercase mb-3 pb-2 border-bottom text-white" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", borderColor: "rgba(255,255,255,0.1)" }}>
                      Progress
                    </div>
                    <div style={{ height: 200, width: "100%" }}>
                      <canvas id="adminProgressChart"></canvas>
                    </div>
                  </div>
                </div>

              </div>

              {/* WORKOUT */}
              <div className="glass-panel w-100 mb-3 overflow-hidden">
                <div className="fw-bold text-uppercase p-3 border-bottom text-white" style={{ background: "rgba(0,0,0,0.5)", letterSpacing: "1px", fontSize: "0.8rem" }}>Workout Plan</div>
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
                <div className="fw-bold text-uppercase p-3 border-bottom text-white" style={{ background: "rgba(0,0,0,0.5)", letterSpacing: "1px", fontSize: "0.8rem" }}>Diet Plan</div>
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


