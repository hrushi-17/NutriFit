export default function Footer() {
    const PILLS = [
        { icon: "fa-dumbbell", label: "Fitness" },
        { icon: "fa-utensils", label: "Nutrition" },
        { icon: "fa-heart-pulse", label: "Health" },
        { icon: "fa-chart-line", label: "Progress" },
    ];

    return (
        <>
            <footer style={{
                width: "100%",
                background: "linear-gradient(90deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
                borderTop: "1px solid rgba(229, 9, 20, 0.25)",
                position: "relative",
                overflow: "hidden",
            }}>

                {/* Radial bg glow */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 65%)",
                    pointerEvents: "none",
                }} />

                {/* Animated top glow line */}
                <div className="nf-glow-line" />

                {/* ══════════════════════════════════════════════════════════
            DESKTOP ( > 992px ): single row — 3 columns
            [NUTRIFIT]        [Copyright center]        [Pills]
            ══════════════════════════════════════════════════════════ */}
                <div className="nf-desktop-row">

                    {/* LEFT — brand */}
                    <div className="nf-brand">
                        <span className="nf-brand-nutri">NUTRI</span>
                        <span className="nf-brand-fit">FIT</span>
                    </div>

                    {/* CENTER — copyright */}
                    <div className="nf-copy">
                        <span className="nf-copy-year" style={{ color: "#606060" }}>&copy; Copyright 2026</span>
                        <span style={{ color: "rgba(229,9,20,0.5)", fontSize: "0.45rem" }}>&#9679;</span>
                        <span style={{ color: "#909090" }}>Designed and Developed by</span>
                        <span className="nf-copy-author">Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — pills */}
                    <div className="nf-pills">
                        {PILLS.map(({ icon, label }) => (
                            <span key={label} className="nf-pill">
                                <i className={`fa-solid ${icon} nf-pill-icon`} style={{ color: "rgba(229,9,20,0.7)" }} />
                                <span>{label}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
            MOBILE / TABLET ( ≤ 992px ): two rows
            Row 1: [NUTRIFIT]                        [Pills] (space-between)
            Row 2:         [Copyright — centered]
            ══════════════════════════════════════════════════════════ */}
                <div className="nf-mobile-wrap">

                    {/* Row 1 */}
                    <div className="nf-mobile-row1">
                        <div className="nf-brand nm">
                            <span className="nf-brand-nutri">NUTRI</span>
                            <span className="nf-brand-fit">FIT</span>
                        </div>
                        <div className="nf-pills nm">
                            {PILLS.map(({ icon, label }) => (
                                <span key={label} className="nf-pill nm">
                                    <i className={`fa-solid ${icon} nf-pill-icon-nm`} style={{ color: "rgba(229,9,20,0.7)" }} />
                                    <span>{label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Thin divider between rows */}
                    <div className="nf-row-divider" />

                    {/* Row 2 */}
                    <div className="nf-mobile-row2">
                        <div className="nf-copy nm">
                            <span style={{ color: "#606060" }}>&copy; Copyright 2026</span>
                            <span style={{ color: "rgba(229,9,20,0.5)", fontSize: "0.4rem" }}>&#9679;</span>
                            <span style={{ color: "#909090" }}>Designed and Developed by</span>
                            <span className="nf-copy-author">Hrushikesh Chothe</span>
                        </div>
                    </div>
                </div>

            </footer>

            <style>{`
        /* ── GLOW LINE ── */
        .nf-glow-line {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          height: 2px; border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent);
          box-shadow: 0 0 22px rgba(229,9,20,0.55);
          pointer-events: none;
          animation: nfGlowAnim 3s ease-in-out infinite;
        }
        @keyframes nfGlowAnim {
          0%,100% { opacity:0.55; width:44%; }
          50%      { opacity:1;   width:62%; }
        }

        /* ── GLOBALS ── */
        .nf-brand-nutri {
          color: #e50914;
          text-shadow: 0 0 18px rgba(229,9,20,0.9), 0 0 44px rgba(229,9,20,0.3);
        }
        .nf-brand-fit {
          color: #ffffff;
        }
        .nf-copy-author {
          color: #e50914;
          font-weight: 700;
          text-shadow: 0 0 12px rgba(229,9,20,0.4);
        }

        /* ═══════════════ DESKTOP STYLES (> 992px) ═══════════════ */
        .nf-desktop-row {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          min-height: 68px;
          max-width: 1300px;
          margin: 0 auto;
          /* Fluid padding so it shrinks before breaking */
          padding: 0 clamp(10px, 2vw, 28px);
          gap: clamp(8px, 1.5vw, 16px);
          box-sizing: border-box;
        }
        .nf-mobile-wrap { display: none; }

        .nf-brand {
          font-family: 'Bebas Neue', 'Roboto', sans-serif;
          /* Fluid size between 1.2rem and 1.55rem */
          font-size: clamp(1.2rem, 1.8vw, 1.55rem);
          letter-spacing: clamp(3px, 0.4vw, 5px);
          flex-shrink: 0;
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }

        .nf-copy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          /* Fluid size and gap */
          font-size: clamp(0.6rem, 1vw, 0.76rem);
          gap: clamp(3px, 0.5vw, 6px);
          text-align: center;
          font-family: 'Roboto', sans-serif;
          line-height: 1.5;
          white-space: nowrap;
        }
        /* Make internal items shrink nicely */
        .nf-copy-author {
          letter-spacing: clamp(0.3px, 0.1vw, 0.7px);
        }

        .nf-pills {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: clamp(3px, 0.6vw, 6px);
          flex-wrap: nowrap;
        }
        .nf-pill {
          display: inline-flex;
          align-items: center;
          gap: clamp(3px, 0.5vw, 5px);
          padding: clamp(3px, 0.5vw, 5px) clamp(5px, 0.8vw, 11px);
          background: rgba(229,9,20,0.07);
          border: 1px solid rgba(229,9,20,0.22);
          border-radius: 20px;
          font-size: clamp(0.48rem, 0.8vw, 0.59rem);
          font-weight: 700;
          letter-spacing: clamp(0.5px, 0.1vw, 1px);
          text-transform: uppercase;
          color: #777;
          white-space: nowrap;
        }
        .nf-pill-icon {
          font-size: clamp(0.5rem, 0.9vw, 0.62rem);
        }

        /* ═══════════════ TABLET & MOBILE (≤ 992px) ═══════════════ */
        @media (max-width: 992px) {
          .nf-desktop-row { display: none; }
          .nf-mobile-wrap { display: block; }
          
          /* Two rows, each exactly 68px */
          .nf-mobile-row1, .nf-mobile-row2 {
            display: flex;
            align-items: center;
            height: 68px;
            padding: 0 clamp(8px, 3vw, 24px);
            box-sizing: border-box;
          }
          
          .nf-mobile-row1 {
            justify-content: space-between; /* Brand Left, Pills Right */
          }
          
          .nf-mobile-row2 {
            justify-content: center; /* Copyright Center */
          }

          /* Subtle divider */
          .nf-row-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 50%, transparent);
            margin: 0 10%;
          }

          /* ── Mobile Scale (Fluid typography using viewport width) ── */
          .nf-brand.nm {
            font-size: clamp(1.2rem, 4vw, 1.55rem);
            letter-spacing: clamp(2px, 0.8vw, 5px);
          }
          
          .nf-pills.nm {
            gap: clamp(2px, 1vw, 6px);
          }
          
          .nf-pill.nm {
            padding: clamp(3px, 1vw, 5px) clamp(4px, 1.5vw, 10px);
            font-size: clamp(0.45rem, 1.5vw, 0.59rem);
            gap: clamp(2px, 0.8vw, 4px);
            letter-spacing: clamp(0.3px, 0.1vw, 1px);
          }
          .nf-pill-icon-nm {
            font-size: clamp(0.45rem, 1.5vw, 0.62rem);
          }
          
          .nf-copy.nm {
            flex: unset;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: clamp(2px, 1.5vw, 6px);
            font-size: clamp(0.6rem, 2vw, 0.78rem);
            white-space: nowrap; /* Keep it single line */
          }
          .nf-copy.nm .nf-copy-author {
            letter-spacing: clamp(0.2px, 0.1vw, 0.7px);
          }
        }
      `}</style>
        </>
    );
}
