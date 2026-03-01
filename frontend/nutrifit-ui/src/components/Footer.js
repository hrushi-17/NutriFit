import "../styles/components/Footer.css";

export default function Footer() {
    return (
        <>
            <footer className="nf-footer">
                {/* Animated top glow line */}
                <div className="nf-footer__glow-line" />

                <div className="nf-footer__inner">

                    {/* LEFT — Brand */}
                    <span className="nf-footer__brand">
                        NUTRI<span className="nf-footer__brand-red">FIT</span>
                    </span>

                    {/* CENTER — Copyright */}
                    <span className="nf-footer__copy">
                        &copy; Copyright 2026&nbsp;
                        <span className="nf-footer__pipe">|</span>
                        &nbsp;Designed &amp; Developed by&nbsp;
                        <span className="nf-footer__author">Hrushikesh Chothe</span>
                    </span>

                    {/* RIGHT — Tag */}
                    <span className="nf-footer__tag">
                        <i className="fa-solid fa-shield-halved" />
                        &nbsp;Premium Health Platform
                    </span>

                </div>
            </footer>
        </>
    );
}
