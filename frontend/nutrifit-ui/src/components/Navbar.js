import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

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
    <nav className="navbar navbar-expand-lg netflix-navbar sticky-top animate-fade-down">
      <div className="container-fluid px-2">

        {/* Brand Logo - Pure Typography */}
        <Link className="netflix-brand" to="/">
          <span className="brand-red">NUTRI</span><span className="brand-white">FIT</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler netflix-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          ☰
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Nav links can be placed here if needed */}
          </ul>

          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {!token ? (
              <>
                <Link className="nav-btn-signin" to="/login">
                  SIGN IN
                </Link>
                <Link className="btn-netflix" to="/register">
                  GET STARTED
                </Link>
              </>
            ) : (
              <>
                {role === "admin" && (
                  <Link className="nav-outline-btn me-3" to="/admin">
                    ADMIN PANEL
                  </Link>
                )}

                {role === "user" && (
                  <Link className="nav-outline-btn me-3" to="/profile">
                    PROFILE
                  </Link>
                )}

                <button
                  className="nav-outline-btn nav-outline-red"
                  onClick={logout}
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}