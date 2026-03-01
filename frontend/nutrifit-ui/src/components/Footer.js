export default function Footer() {
    return (
        <>
            <footer style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1040,
                /* match navbar height: py-3 (16+16) + ~40px content ≈ 72px */
                height: "72px",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(0,0,0,0.97) 100%)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderTop: "1px solid rgba(229,9,20,0.22)",
                padding: "0 24px",
                boxSizing: "border-box",
            }}>
                {/* Animated red glow line at top */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "1px",
                    width: "55%",
                    background: "linear-gradient(90deg, transparent 0%, rgba(229,9,20,0.5) 30%, #e50914 50%, rgba(229,9,20,0.5) 70%, transparent 100%)",
                    boxShadow: "0 0 18px rgba(229,9,20,0.4), 0 0 40px rgba(229,9,20,0.15)",
                    animation: "nfGlowPulse 3s ease-in-out infinite",
                    pointerEvents: "none",
                }} />

                {/* ── INNER LAYOUT ─────────────────────────────── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    gap: "12px",
                    flexWrap: "wrap",
                }}>

                    {/* LEFT: Brand logotype */}
                    <span style={{
                        fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                        fontSize: "1.45rem",
                        fontWeight: 900,
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                        flexShrink: 0,
                    }}>
                        <span style={{ color: "#e50914", textShadow: "0 0 12px rgba(229,9,20,0.6)" }}>NUTRI</span>FIT
                    </span>

                    {/* CENTER: Copyright */}
                    <span style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 400,
                        color: "#5a5a5a",
                        letterSpacing: "0.3px",
                        textAlign: "center",
                        flex: 1,
                        minWidth: "180px",
                        lineHeight: 1.4,
                    }}>
                        &copy; Copyright 2026&nbsp;
                        <span style={{ color: "#808080" }}>Designed and Developed by</span>&nbsp;
                        <span style={{
                            fontWeight: 700,
                            color: "#e50914",
                            letterSpacing: "0.5px",
                            cursor: "default",
                        }}>
                            Hrushikesh Chothe
                        </span>
                    </span>

                    {/* RIGHT: Tagline */}
                    <span style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#333",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}>
                        <i className="fa-solid fa-shield-halved" style={{ marginRight: "5px", color: "#e50914", opacity: 0.5 }} />
                        Premium Health Platform
                    </span>

                </div>
            </footer>

            {/* Keyframe for glow animation */}
            <style>{`
        @keyframes nfGlowPulse {
          0%,  100% { opacity: 0.6; width: 44%; }
          50%        { opacity: 1;   width: 60%; }
        }

        /* ── TABLET (≤ 768px) ── */
        @media (max-width: 768px) {
          .nf-footer-right { display: none !important; }
        }

        /* ── MOBILE (≤ 480px) ── */
        @media (max-width: 480px) {
          .nf-footer-brand { display: none !important; }
          .nf-footer-copy  { text-align: center; font-size: 0.62rem !important; }
        }
      `}</style>
        </>
    );
}
