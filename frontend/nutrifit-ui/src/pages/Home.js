import { Link } from "react-router-dom";
import "../styles/pages/Home.css";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-hero-section animate-fade-down">
      <div className="home-overlay"></div>

      <div className="home-hero-content px-4">
        <h1 className="home-title animate-fade-up delay-1">
          Smart Health<br />
          <span className="red-text">Real Results</span>
        </h1>

        <p className="home-subtitle animate-fade-up delay-2">
          Your premium fitness, nutrition, and wellness tracking platform.
          Built for champions.
        </p>

        <div className="home-cta-group animate-fade-up delay-3">
          {!token ? (
            <>
              <Link to="/register" className="btn-hero btn-hero-primary">
                Get Started <i className="fa-solid fa-chevron-right ms-2 fs-6"></i>
              </Link>
              <Link to="/login" className="btn-hero btn-hero-secondary">
                Sign In
              </Link>
            </>
          ) : (
            <Link to="/profile" className="btn-hero btn-hero-primary">
              Enter Dashboard <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}