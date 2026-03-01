import "../styles/components/Footer.css";

export default function Footer() {
    return (
        <footer className="nf-footer">
            {/* Animated top glow line */}
            <div className="nf-footer__glow-line" />

            <div className="nf-footer__inner">

                {/* Left – brand */}
                <span className="nf-footer__brand">
                    NUTRI<span className="nf-footer__brand-red">FIT</span>
                </span>

                {/* Center – copyright */}
                <span className="nf-footer__copy">
                    &copy; Copyright 2026&nbsp;&nbsp;|&nbsp;&nbsp;
                    <span className="nf-footer__label">Designed &amp; Developed by</span>&nbsp;
                    <span className="nf-footer__author">Hrushikesh Chothe</span>
                </span>

                {/* Right – tag */}
                <span className="nf-footer__tag">
                    <i className="fa-solid fa-shield-halved" />&nbsp;Premium Health Platform
                </span>

            </div>
        </footer>
    );
}
