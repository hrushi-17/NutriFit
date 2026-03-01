export default function Footer() {
    return (
        <>
            <footer style={{
                width: "100%",
                background: "linear-gradient(180deg, rgba(10,10,10,0.95) 0%, #000000 100%)",
                borderTop: "1px solid rgba(229, 9, 20, 0.3)",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
                padding: "22px 32px",
                boxSizing: "border-box",
                position: "relative",
            }}>

                {/* Glow line at very top */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "55%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent)",
                    boxShadow: "0 0 20px rgba(229,9,20,0.5)",
                    borderRadius: "999px",
                    animation: "nfFooterGlow 3s ease-in-out infinite",
                    pointerEvents: "none",
                }} />

                {/* Main content row */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}>

                    {/* LEFT — NUTRIFIT brand logotype */}
                    <div style={{
                        fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        letterSpacing: "5px",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        userSelect: "none",
                        flexShrink: 0,
                    }}>
                        <span style={{
                            color: "#e50914",
                            textShadow: "0 0 18px rgba(229,9,20,0.8), 0 0 40px rgba(229,9,20,0.3)",
                        }}>NUTRI</span>
                        <span style={{ color: "#ffffff" }}>FIT</span>
                    </div>

                    {/* CENTER — copyright */}
                    <div style={{
                        flex: 1,
                        textAlign: "center",
                        minWidth: "200px",
                    }}>
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 400,
                            color: "#b3b3b3",
                            letterSpacing: "0.3px",
                            lineHeight: 1.6,
                        }}>
                            <span style={{ color: "#808080" }}>© Copyright 2026</span>
                            <span style={{ color: "rgba(229,9,20,0.45)", fontSize: "0.6rem" }}>●</span>
                            <span style={{ color: "#a3a3a3" }}>Designed and Developed by</span>
                            <span style={{
                                color: "#e50914",
                                fontWeight: 700,
                                letterSpacing: "0.8px",
                                fontSize: "0.82rem",
                                textShadow: "0 0 12px rgba(229,9,20,0.4)",
                            }}>Hrushikesh Chothe</span>
                        </span>
                    </div>

                    {/* RIGHT — shield tag */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "1.8px",
                        textTransform: "uppercase",
                        color: "#555555",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: "rgba(229,9,20,0.5)" }} />
                        Premium Health Platform
                    </div>

                </div>
            </footer>

            <style>{`
        @keyframes nfFooterGlow {
          0%, 100% { opacity: 0.55; width: 44%; }
          50%       { opacity: 1;   width: 62%; }
        }
        @media (max-width: 900px) {
          .nf-tag { display: none; }
        }
        @media (max-width: 560px) {
          .nf-brand { font-size: 1.1rem !important; }
          .nf-copy  { font-size: 0.65rem !important; }
        }
      `}</style>
        </>
    );
}
