export default function Footer() {
    return (
        <>
            <footer style={{
                width: "100%",
                background: "linear-gradient(90deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
                borderTop: "1px solid rgba(229, 9, 20, 0.25)",
                position: "relative",
                overflow: "hidden",
            }}>

                {/* Subtle radial glow behind */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.07) 0%, transparent 65%)",
                    pointerEvents: "none",
                }} />

                {/* Animated top glow line */}
                <div className="nf-glow-line" style={{
                    position: "absolute", top: 0, left: "50%",
                    transform: "translateX(-50%)",
                    height: "2px", borderRadius: "999px",
                    background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent)",
                    boxShadow: "0 0 20px rgba(229,9,20,0.5)",
                    pointerEvents: "none",
                }} />

                {/* ── Single Row ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "14px 28px",
                }}>

                    {/* LEFT — NUTRIFIT brand */}
                    <div className="nf-footer-brand" style={{ flexShrink: 0 }}>
                        <span style={{
                            fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                            fontSize: "1.5rem",
                            fontWeight: 900,
                            letterSpacing: "5px",
                            lineHeight: 1,
                            userSelect: "none",
                        }}>
                            <span style={{
                                color: "#e50914",
                                textShadow: "0 0 18px rgba(229,9,20,0.9), 0 0 45px rgba(229,9,20,0.3)",
                            }}>NUTRI</span>
                            <span style={{ color: "#ffffff" }}>FIT</span>
                        </span>
                    </div>

                    {/* CENTER — copyright */}
                    <div className="nf-footer-copy" style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "0.74rem",
                        lineHeight: 1.5,
                        color: "#a3a3a3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "6px",
                    }}>
                        <span style={{ color: "#555" }}>&copy; Copyright 2026</span>
                        <span style={{ color: "rgba(229,9,20,0.5)", fontSize: "0.5rem", lineHeight: 1 }}>&#9679;</span>
                        <span style={{ color: "#888" }}>Designed and Developed by</span>
                        <span style={{
                            color: "#e50914",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            letterSpacing: "0.6px",
                            textShadow: "0 0 12px rgba(229,9,20,0.4)",
                        }}>Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — pill badges */}
                    <div className="nf-footer-pills" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                    }}>
                        {[
                            { icon: "fa-dumbbell", label: "Fitness" },
                            { icon: "fa-utensils", label: "Nutrition" },
                            { icon: "fa-heart-pulse", label: "Health" },
                            { icon: "fa-chart-line", label: "Progress" },
                        ].map(({ icon, label }) => (
                            <span key={label} style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "4px 10px",
                                background: "rgba(229,9,20,0.07)",
                                border: "1px solid rgba(229,9,20,0.18)",
                                borderRadius: "20px",
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                color: "#666",
                                whiteSpace: "nowrap",
                            }}>
                                <i className={`fa-solid ${icon}`} style={{ color: "rgba(229,9,20,0.6)", fontSize: "0.6rem" }} />
                                {label}
                            </span>
                        ))}
                    </div>

                </div>
            </footer>

            <style>{`
        /* Glow animation */
        .nf-glow-line {
          width: 55%;
          animation: nfGlowAnim 3s ease-in-out infinite;
        }
        @keyframes nfGlowAnim {
          0%, 100% { opacity: 0.55; width: 44%; }
          50%       { opacity: 1;   width: 62%; }
        }

        /* TABLET (≤ 900px): hide pills, stack pills in 2 columns */
        @media (max-width: 900px) {
          .nf-footer-pills span { font-size: 0.52rem !important; padding: 3px 8px !important; }
        }

        /* MOBILE LANDSCAPE (≤ 680px): hide pills, shrink brand */
        @media (max-width: 680px) {
          .nf-footer-pills { display: none !important; }
          .nf-footer-brand span { font-size: 1.15rem !important; letter-spacing: 3px !important; }
          .nf-footer-copy  { font-size: 0.65rem !important; }
        }

        /* MOBILE PORTRAIT (≤ 420px): stack brand + copy vertically */
        @media (max-width: 420px) {
          .nf-footer-brand { display: none !important; }
          .nf-footer-copy  { font-size: 0.62rem !important; text-align: center !important; }
        }
      `}</style>
        </>
    );
}
