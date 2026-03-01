export default function Footer() {
    return (
        <>
            {/* ── FIXED FOOTER ── */}
            <footer style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                height: "56px",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(90deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)",
                borderTop: "1px solid rgba(229, 9, 20, 0.4)",
                boxShadow: "0 -4px 30px rgba(0,0,0,0.8), 0 -1px 0 rgba(229,9,20,0.15)",
                padding: "0 24px",
                boxSizing: "border-box",
            }}>

                {/* ── Inner row ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}>

                    {/* LEFT — NUTRIFIT logotype */}
                    <div style={{
                        fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        letterSpacing: "4px",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        userSelect: "none",
                        flexShrink: 0,
                    }}>
                        <span style={{
                            color: "#e50914",
                            textShadow: "0 0 16px rgba(229,9,20,0.8), 0 0 40px rgba(229,9,20,0.3)",
                        }}>NUTRI</span>
                        <span style={{ color: "#ffffff" }}>FIT</span>
                    </div>

                    {/* CENTER — copyright */}
                    <div style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "0.73rem",
                        fontWeight: 400,
                        color: "#e5e5e5",
                        letterSpacing: "0.3px",
                        lineHeight: 1.4,
                        padding: "0 16px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        <span style={{ color: "#808080" }}>&copy; Copyright 2026</span>
                        <span style={{ color: "rgba(229,9,20,0.5)", margin: "0 10px" }}>|</span>
                        <span style={{ color: "#a3a3a3" }}>Designed and Developed by</span>
                        {" "}
                        <span style={{
                            color: "#e50914",
                            fontWeight: 700,
                            letterSpacing: "0.8px",
                            textShadow: "0 0 10px rgba(229,9,20,0.4)",
                        }}>Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — shield tag */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#555",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: "rgba(229,9,20,0.5)", fontSize: "0.7rem" }} />
                        Premium Health
                    </div>

                </div>

                {/* Glow line at top */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.7) 30%, #e50914 50%, rgba(229,9,20,0.7) 70%, transparent)",
                    boxShadow: "0 0 20px rgba(229,9,20,0.5)",
                    borderRadius: "999px",
                    animation: "nfFooterGlow 3s ease-in-out infinite",
                    pointerEvents: "none",
                }} />
            </footer>

            {/* Keyframes + responsive overrides */}
            <style>{`
        @keyframes nfFooterGlow {
          0%,100% { opacity: 0.6; width: 42%; }
          50%      { opacity: 1;   width: 60%; }
        }

        /* Tablet */
        @media (max-width: 900px) {
          .nf-right-tag { display: none !important; }
        }

        /* Mobile */
        @media (max-width: 580px) {
          .nf-brand-left { display: none !important; }
          .nf-copy-center {
            text-align: center !important;
            white-space: normal !important;
            font-size: 0.63rem !important;
          }
        }
      `}</style>
        </>
    );
}
