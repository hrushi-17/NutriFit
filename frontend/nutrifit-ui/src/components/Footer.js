import "../styles/components/Footer.css";

export default function Footer() {
    return (
        <footer className="nutrifit-footer">
            {/* Glowing top border line */}
            <div className="footer-glow-line"></div>

            <div className="footer-inner">
                {/* Brand mark */}
                <span className="footer-brand">
                    NUTRI<span className="footer-brand-red">FIT</span>
                </span>

                {/* Divider */}
                <span className="footer-divider">|</span>

                {/* Copyright text */}
                <span className="footer-copy">
                    &copy; Copyright 2026{" "}
                    <span className="footer-highlight">Designed and Developed by</span>{" "}
                    <span className="footer-author">Hrushikesh Chothe</span>
                </span>
            </div>
        </footer>
    );
}
