export default function Footer() {
    return (
        <>
            <footer style={{
                width: "100%",
                background: "linear-gradient(180deg, #0a0a0a 0%, #111111 60%, #0d0d0d 100%)",
                borderTop: "1px solid rgba(229, 9, 20, 0.25)",
                position: "relative",
                overflow: "hidden",
            }}>

                {/* ── Background subtle red radial glow ── */}
                <div style={{
                    position: "absolute",
                    top: 0, left: "50%",
                    transform: "translateX(-50%)",
                    width: "600px", height: "120px",
                    background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* ── Animated glow line ── */}
                <div style={{
                    position: "absolute",
                    top: 0, left: "50%",
                    transform: "translateX(-50%)",
                    width: "55%", height: "2px",
                    background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent)",
                    boxShadow: "0 0 24px rgba(229,9,20,0.55)",
                    borderRadius: "999px",
                    animation: "nfGlow 3s ease-in-out infinite",
                    pointerEvents: "none",
                }} />

                {/* ══════════ TOP SECTION ══════════ */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "20px",
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "28px 32px 20px",
                }}>

                    {/* LEFT — Brand block */}
                    <div>
                        <div style={{
                            fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                            fontSize: "1.9rem",
                            fontWeight: 900,
                            letterSpacing: "6px",
                            lineHeight: 1,
                            userSelect: "none",
                            marginBottom: "6px",
                        }}>
                            <span style={{
                                color: "#e50914",
                                textShadow: "0 0 20px rgba(229,9,20,0.9), 0 0 50px rgba(229,9,20,0.3)",
                            }}>NUTRI</span>
                            <span style={{ color: "#ffffff" }}>FIT</span>
                        </div>
                        <div style={{
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "2.5px",
                            textTransform: "uppercase",
                            color: "#444",
                        }}>
                            Premium Health Platform
                        </div>
                    </div>

                    {/* RIGHT — tagline badges */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}>
                        {[
                            { icon: "fa-dumbbell", label: "Fitness" },
                            { icon: "fa-utensils", label: "Nutrition" },
                            { icon: "fa-heart-pulse", label: "Health" },
                            { icon: "fa-chart-line", label: "Progress" },
                        ].map(({ icon, label }) => (
                            <div key={label} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "5px 12px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "20px",
                                fontSize: "0.62rem",
                                fontWeight: 600,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                color: "#555",
                                whiteSpace: "nowrap",
                            }}>
                                <i className={`fa-solid ${icon}`} style={{ color: "rgba(229,9,20,0.5)", fontSize: "0.65rem" }} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Thin separator ── */}
                <div style={{
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "0 32px",
                }}>
                    <div style={{
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
                    }} />
                </div>

                {/* ══════════ BOTTOM BAR ══════════ */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "16px 32px 20px",
                    textAlign: "center",
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: "0.76rem",
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: "#a3a3a3",
                        letterSpacing: "0.3px",
                    }}>
                        <span style={{ color: "#606060" }}>© Copyright 2026</span>
                        <span style={{
                            display: "inline-block",
                            width: "4px", height: "4px",
                            background: "rgba(229,9,20,0.5)",
                            borderRadius: "50%",
                            margin: "0 10px 2px",
                            verticalAlign: "middle",
                        }} />
                        <span style={{ color: "#a3a3a3" }}>Designed and Developed by </span>
                        <span style={{
                            color: "#e50914",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            letterSpacing: "0.8px",
                            textShadow: "0 0 14px rgba(229,9,20,0.45)",
                        }}>Hrushikesh Chothe</span>
                        <span style={{
                            display: "inline-block",
                            width: "4px", height: "4px",
                            background: "rgba(229,9,20,0.5)",
                            borderRadius: "50%",
                            margin: "0 10px 2px",
                            verticalAlign: "middle",
                        }} />
                        <span style={{ color: "#444", fontSize: "0.7rem" }}>All rights reserved.</span>
                    </p>
                </div>

            </footer>

            <style>{`
        @keyframes nfGlow {
          0%, 100% { opacity: 0.55; width: 44%; }
          50%       { opacity: 1;   width: 62%; }
        }
        @media (max-width: 600px) {
          .nf-tag-pills { display: none !important; }
        }
      `}</style>
        </>
    );
}
