import "../styles/components/Footer.css";

export default function Footer() {
    return (
        <footer className="nf-footer">

            {/* Animated red glow line at the top edge */}
            <div className="nf-footer__glow" />

            {/* 3-column inner row */}
            <div className="nf-footer__inner">

                {/* LEFT — NUTRIFIT brand logotype */}
                <span className="nf-footer__brand">
                    <span className="nf-footer__brand-red">NUTRI</span>FIT
                </span>

                {/* Divider */}
                <div className="nf-footer__divider" />

                {/* CENTER — copyright */}
                <span className="nf-footer__copy">
                    &copy; Copyright 2026&nbsp;&nbsp;
                    <span className="nf-footer__copy-label">Designed and Developed by</span>
                    &nbsp;
                    <span className="nf-footer__copy-author">Hrushikesh Chothe</span>
                </span>

                {/* Divider */}
                <div className="nf-footer__divider" />

                {/* RIGHT — premium tag */}
                <span className="nf-footer__tag">
                    <i className="fa-solid fa-shield-halved" />
                    Premium Health Platform
                </span>

            </div>
        </footer>
    );
}
