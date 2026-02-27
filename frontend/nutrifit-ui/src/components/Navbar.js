import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top animate-fade-down" style={{ background: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(15px)", borderBottom: "1px solid var(--glass-border)", zIndex: 1050, transition: "0.3s" }}>
      <div className="container-fluid">

        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          <i className="fa-solid fa-heart-pulse fs-3 me-2" style={{ color: "var(--accent-red)" }}></i>
          <span className="fw-bolder fs-4 text-white" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "var(--accent-red)" }}>NUTRI</span>FIT
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{ color: "white" }}>
          <i className="fa-solid fa-bars fs-3"></i>
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Optional Links can go here */}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {!token ? (
              <>
                <Link className="text-white text-decoration-none fw-semibold" to="/login" style={{ transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent-red)"} onMouseLeave={e => e.currentTarget.style.color = "white"}>
                  Sign In
                </Link>
                <Link className="btn-netflix px-4 py-2" to="/register">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {role === "admin" && (
                  <Link className="btn-outline-glass px-4 py-2" to="/admin" style={{ borderColor: "var(--accent-warning)", color: "var(--accent-warning)" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-warning)"; e.currentTarget.style.color = "#000"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-warning)"; }}>
                    <i className="fa-solid fa-user-shield me-2"></i> Admin Panel
                  </Link>
                )}

                {role === "user" && (
                  <Link className="btn-outline-glass px-4 py-2" to="/profile" style={{ borderColor: "var(--accent-blue)", color: "var(--accent-blue)" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-blue)"; e.currentTarget.style.color = "white"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-blue)"; }}>
                    <i className="fa-solid fa-user me-2"></i> Profile
                  </Link>
                )}

                <button
                  className="btn-netflix px-4 py-2"
                  onClick={logout}
                  style={{ background: "transparent", border: "1px solid var(--accent-red)", color: "var(--accent-red)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-red)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-red)"; }}
                >
                  <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}