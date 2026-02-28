import "../styles/components/Navbar.css";
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
        <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/" style={{ transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          <img
            src="/images/Nutrifit-logo.png"
            alt="NutriFit Logo"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
              filter: "brightness(0) saturate(100%) invert(18%) sepia(86%) saturate(6011%) hue-rotate(352deg) brightness(96%) contrast(106%) drop-shadow(0 0 8px rgba(229, 9, 20, 0.6))"
            }}
            className="me-2"
          />
          <span style={{ fontFamily: "'Bebas Neue', 'Roboto', sans-serif", fontSize: "2.2rem", letterSpacing: "2px", fontWeight: "900", color: "#fff", textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.5)", lineHeight: "1" }}>
            <span style={{ color: "var(--accent-red)" }}>NUTRI</span>FIT
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#netflixOffcanvas" aria-controls="netflixOffcanvas" style={{ color: "white" }}>
          <i className="fa-solid fa-bars fs-3"></i>
        </button>

        {/* Nav Items */}
        {/* Offcanvas Mobile Menu */}
        <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="netflixOffcanvas" aria-labelledby="netflixOffcanvasLabel" style={{ width: "300px", background: "var(--bg-dark) !important", borderLeft: "1px solid var(--border-light)" }}>
          <div className="offcanvas-header border-bottom border-dark">
            <h5 className="offcanvas-title fw-bold" id="netflixOffcanvasLabel" style={{ letterSpacing: "1px" }}>
              <span style={{ color: "var(--accent-red)" }}>NUTRI</span>FIT
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="navbar-nav mb-4">
              {/* Future Mobile specific Links can be added here */}
            </ul>

            <div className="d-flex flex-column gap-3 mt-auto mb-4">
              {!token ? (
                <>
                  <Link className="text-white text-decoration-none fw-semibold text-center py-2" to="/login" style={{ transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent-red)"} onMouseLeave={e => e.currentTarget.style.color = "white"}>
                    Sign In
                  </Link>
                  <Link className="btn-netflix w-100 text-center py-2" to="/register">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {role === "admin" && (
                    <Link className="btn-outline-glass w-100 text-center py-2" to="/admin" style={{ borderColor: "var(--accent-warning)", color: "var(--accent-warning)" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-warning)"; e.currentTarget.style.color = "#000"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-warning)"; }}>
                      <i className="fa-solid fa-user-shield me-2"></i> Admin Panel
                    </Link>
                  )}

                  {role === "user" && (
                    <Link className="btn-outline-glass w-100 text-center py-2" to="/profile" style={{ borderColor: "var(--accent-blue)", color: "var(--accent-blue)" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-blue)"; e.currentTarget.style.color = "white"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-blue)"; }}>
                      <i className="fa-solid fa-user me-2"></i> Profile
                    </Link>
                  )}

                  <button
                    className="btn-netflix w-100 py-2 mt-2"
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

      </div>
    </nav>
  );
}