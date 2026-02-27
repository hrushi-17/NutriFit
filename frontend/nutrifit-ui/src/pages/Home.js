import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container" style={{ minHeight: "calc(100vh - 76px)", background: "var(--bg-dark)", color: "white", position: "relative", overflow: "hidden" }}>

      {/* Background Glow Effects */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(229, 9, 20, 0.15) 0%, rgba(0,0,0,0) 70%)", zIndex: 0 }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)", zIndex: 0 }}></div>

      <div className="container position-relative py-5" style={{ zIndex: 1 }}>
        <div className="row align-items-center min-vh-75 mt-5 pt-4">

          {/* Hero Content */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 animate-fade-up">
            <span className="badge rounded-pill mb-3 py-2 px-3 fw-bold" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-green)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <i className="fa-solid fa-bolt text-warning me-2"></i> LEVEL UP YOUR FITNESS
            </span>
            <h1 className="display-3 fw-bolder mb-4" style={{ letterSpacing: "-1px", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              Smart Health, <br />
              <span style={{ color: "var(--accent-red)" }}>Real Results.</span>
            </h1>
            <p className="lead text-muted mb-5 fw-semibold" style={{ fontSize: "1.2rem", maxWidth: "500px", margin: "0 auto 0 0" }}>
              Experience the corporate standard in personal health tracking. Tailored diets, AI-driven workout plans, and real-time progress analytics.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link to="/register" className="btn-health px-5 py-3 fs-5 fw-bold d-flex align-items-center justify-content-center">
                Start Your Journey <i className="fa-solid fa-arrow-right ms-2 animate-bounce-x"></i>
              </Link>
              <Link to="/login" className="btn-outline-glass px-5 py-3 fs-5 fw-bold d-flex align-items-center justify-content-center">
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Graphics / Glassmorphism showcase */}
          <div className="col-lg-6 position-relative animate-fade-up delay-2">
            <div className="premium-card p-4 mx-auto" style={{ maxWidth: "450px", transform: "rotate(3deg)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10, 10, 10, 0.6)", backdropFilter: "blur(20px)" }}>

              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h5 className="mb-0 fw-bold">🎯 Daily Goal</h5>
                <span className="text-muted small">Updated Just Now</span>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "60px", height: "60px", background: "rgba(229, 9, 20, 0.15)", color: "var(--accent-red)" }}>
                  <i className="fa-solid fa-fire-flame-curved fs-3"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">2,450 kcal</h3>
                  <span className="text-muted">Target Burn</span>
                </div>
              </div>

              <div className="progress mb-4" style={{ height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                <div className="progress-bar" role="progressbar" style={{ width: "75%", background: "linear-gradient(90deg, var(--accent-red), #ff4b4b)", borderRadius: "10px" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <i className="fa-solid fa-dumbbell text-info mb-2 fs-4"></i>
                    <h5 className="mb-0 fw-bold">Workout</h5>
                    <span className="small text-muted">Completed</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <i className="fa-solid fa-utensils text-success mb-2 fs-4"></i>
                    <h5 className="mb-0 fw-bold">Nutrition</h5>
                    <span className="small text-muted">On Track</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .animate-bounce-x {
          animation: bounceX 2s infinite ease-in-out;
        }
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}