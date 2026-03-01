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

                {/* Radial background glow */}
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
                <div className="nf-footer-row" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    maxWidth: "1300px",
                    margin: "0 auto",
                    padding: "13px 20px",
                }}>

                    {/* LEFT — NUTRIFIT brand */}
                    <div className="nf-brand" style={{ flexShrink: 0 }}>
                        <span style={{
                            fontFamily: "'Bebas Neue', 'Roboto', sans-serif",
                            letterSpacing: "4px",
                            lineHeight: 1,
                            userSelect: "none",
                            whiteSpace: "nowrap",
                        }}>
                            <span style={{
                                color: "#e50914",
                                textShadow: "0 0 18px rgba(229,9,20,0.9), 0 0 40px rgba(229,9,20,0.3)",
                            }}>NUTRI</span>
                            <span style={{ color: "#ffffff" }}>FIT</span>
                        </span>
                    </div>

                    {/* CENTER — copyright */}
                    <div className="nf-copy" style={{
                        flex: 1,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "4px",
                        color: "#a3a3a3",
                    }}>
                        <span className="nf-copy-year" style={{ color: "#555" }}>&copy; 2026</span>
                        <span style={{ color: "rgba(229,9,20,0.45)", fontSize: "0.45rem" }}>&#9679;</span>
                        <span className="nf-copy-label" style={{ color: "#888", whiteSpace: "nowrap" }}>Designed &amp; Developed by</span>
                        <span className="nf-copy-author" style={{
                            color: "#e50914",
                            fontWeight: 700,
                            letterSpacing: "0.6px",
                            textShadow: "0 0 12px rgba(229,9,20,0.4)",
                            whiteSpace: "nowrap",
                        }}>Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — pill badges (always visible, scale on mobile) */}
                    <div className="nf-pills" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        flexShrink: 0,
                        flexWrap: "nowrap",
                    }}>
                        {[
                            { icon: "fa-dumbbell", label: "Fitness" },
                            { icon: "fa-utensils", label: "Nutrition" },
                            { icon: "fa-heart-pulse", label: "Health" },
                            { icon: "fa-chart-line", label: "Progress" },
                        ].map(({ icon, label }) => (
                            <span key={label} className="nf-pill" style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(229,9,20,0.07)",
                                border: "1px solid rgba(229,9,20,0.2)",
                                borderRadius: "20px",
                                color: "#777",
                                whiteSpace: "nowrap",
                                lineHeight: 1,
                            }}>
                                <i className={`fa-solid ${icon}`} style={{ color: "rgba(229,9,20,0.7)" }} />
                                <span className="nf-pill-label">{label}</span>
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

        /* ── DESKTOP (default) ── */
        .nf-brand span        { font-size: 1.5rem; }
        .nf-copy              { font-size: 0.75rem; }
        .nf-copy-label        { display: inline; }
        .nf-pill              { padding: 4px 10px; font-size: 0.58rem; letter-spacing: 1px; font-weight: 700; text-transform: uppercase; }
        .nf-pill i            { font-size: 0.6rem; }
        .nf-pill-label        { display: inline; }

        /* ── TABLET (≤ 900px) ── */
        @media (max-width: 900px) {
          .nf-brand span       { font-size: 1.15rem; letter-spacing: 3px; }
          .nf-copy             { font-size: 0.65rem; }
          .nf-copy-label       { display: none; }
          .nf-pill             { padding: 3px 7px; font-size: 0.52rem; }
          .nf-pill-label       { display: none; }
          .nf-pill i           { font-size: 0.7rem; }
        }

        /* ── MOBILE (≤ 560px) ── */
        @media (max-width: 560px) {
          .nf-footer-row       { padding: 10px 12px; gap: 6px; }
          .nf-brand span       { font-size: 0.95rem; letter-spacing: 2px; }
          .nf-copy             { font-size: 0.58rem; gap: 3px; }
          .nf-copy-year        { display: none; }
          .nf-pill             { padding: 3px 6px; }
          .nf-pill i           { font-size: 0.65rem; }
          .nf-pills            { gap: 3px; }
        }

        /* ── VERY SMALL (≤ 380px) ── */
        @media (max-width: 380px) {
          .nf-brand span       { font-size: 0.8rem; letter-spacing: 1.5px; }
          .nf-copy             { font-size: 0.52rem; }
          .nf-pill             { padding: 2px 5px; }
          .nf-pill i           { font-size: 0.6rem; }
        }
      `}</style>
        </>
    );
}
