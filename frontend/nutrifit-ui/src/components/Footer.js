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

                {/* ══════════════════════════════════════
            DESKTOP: single row — 3 columns
            [NUTRIFIT]  [Copyright center]  [Pills]
            ══════════════════════════════════════ */}
                <div className="nf-desktop-row">

                    {/* LEFT — brand */}
                    <div className="nf-brand">
                        <span className="nf-brand-nutri">NUTRI</span>
                        <span className="nf-brand-fit">FIT</span>
                    </div>

                    {/* CENTER — copyright */}
                    <div className="nf-copy">
                        <span className="nf-copy-year">&copy; Copyright 2026</span>
                        <span className="nf-dot">&#9679;</span>
                        <span className="nf-copy-label">Designed and Developed by</span>
                        <span className="nf-copy-author">Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — pills */}
                    <div className="nf-pills">
                        {PILLS.map(({ icon, label }) => (
                            <span key={label} className="nf-pill">
                                <i className={`fa-solid ${icon} nf-pill-icon`} />
                                <span className="nf-pill-label">{label}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════
            MOBILE / TABLET: two rows
            Row 1: [NUTRIFIT]          [Pills]
            Row 2:    [Copyright — centered]
            ══════════════════════════════════════ */}
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
                                    <i className={`fa-solid ${icon} nf-pill-icon`} />
                                    <span className="nf-pill-label">{label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Thin divider between rows */}
                    <div className="nf-row-divider" />

                    {/* Row 2 */}
                    <div className="nf-mobile-row2">
                        <div className="nf-copy nm">
                            <span className="nf-copy-year">&copy; Copyright 2026</span>
                            <span className="nf-dot">&#9679;</span>
                            <span className="nf-copy-label">Designed and Developed by</span>
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

        /* ═══════════════ DESKTOP ROW ═══════════════ */
        .nf-desktop-row {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          min-height: 68px;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 28px;
          gap: 12px;
          box-sizing: border-box;
        }
        .nf-mobile-wrap { display: none; }

        /* ═══════════════ SHARED STYLES ═══════════════ */
        .nf-brand {
          flex-shrink: 0;
          font-family: 'Bebas Neue', 'Roboto', sans-serif;
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: 5px;
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }
        .nf-brand-nutri {
          color: #e50914;
          text-shadow: 0 0 18px rgba(229,9,20,0.9), 0 0 44px rgba(229,9,20,0.3);
        }
        .nf-brand-fit { color: #ffffff; }

        .nf-copy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          text-align: center;
          font-family: 'Roboto', sans-serif;
          font-size: 0.76rem;
          line-height: 1.5;
        }
        .nf-copy-year  { color: #606060; white-space: nowrap; }
        .nf-dot        { color: rgba(229,9,20,0.5); font-size: 0.42rem; }
        .nf-copy-label { color: #909090; white-space: nowrap; }
        .nf-copy-author {
          color: #e50914;
          font-weight: 700;
          letter-spacing: 0.7px;
          white-space: nowrap;
          text-shadow: 0 0 12px rgba(229,9,20,0.4);
        }

        .nf-pills {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
        }
        .nf-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: rgba(229,9,20,0.07);
          border: 1px solid rgba(229,9,20,0.22);
          border-radius: 20px;
          font-size: 0.59rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #777;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .nf-pill:hover {
          background: rgba(229,9,20,0.15);
          border-color: rgba(229,9,20,0.5);
          color: #ccc;
        }
        .nf-pill-icon  { color: rgba(229,9,20,0.7); font-size: 0.62rem; }
        .nf-pill-label { display: inline; }

        /* ═══════════════ TABLET & MOBILE (≤ 768px) ═══════════════ */
        @media (max-width: 768px) {
          /* Hide desktop row, show mobile layout */
          .nf-desktop-row { display: none; }
          .nf-mobile-wrap { display: block; }

          /* Row 1: brand left + pills right — 68px */
          .nf-mobile-row1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 68px;
            padding: 0 20px;
            box-sizing: border-box;
          }

          /* Divider */
          .nf-row-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, transparent);
            margin: 0 20px;
          }

          /* Row 2: copyright centered — 68px */
          .nf-mobile-row2 {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 68px;
            padding: 0 16px;
            box-sizing: border-box;
          }

          /* Scale mobile elements */
          .nf-brand.nm      { font-size: 1.15rem; letter-spacing: 3.5px; }
          .nf-pills.nm      { gap: 5px; }
          .nf-pill.nm       { padding: 4px 9px; font-size: 0.54rem; letter-spacing: 0.8px; gap: 4px; }
          .nf-copy.nm       { font-size: 0.72rem; gap: 5px; flex: unset; }
          .nf-copy.nm .nf-copy-author { font-size: 0.76rem; }
        }

        /* ── SMALL MOBILE (≤ 480px) ── */
        @media (max-width: 480px) {
          .nf-mobile-row1, .nf-mobile-row2 { padding: 0 14px; }
          .nf-brand.nm      { font-size: 1rem; letter-spacing: 2.5px; }
          .nf-pill.nm       { padding: 3px 7px; font-size: 0.49rem; }
          .nf-copy.nm       { font-size: 0.65rem; gap: 4px; }
        }

        /* ── VERY SMALL (≤ 360px) ── */
        @media (max-width: 360px) {
          .nf-mobile-row1, .nf-mobile-row2 { padding: 0 10px; }
          .nf-brand.nm      { font-size: 0.85rem; letter-spacing: 2px; }
          .nf-pill.nm       { padding: 3px 6px; font-size: 0.44rem; gap: 3px; }
          .nf-pills.nm      { gap: 3px; }
          .nf-copy.nm       { font-size: 0.58rem; gap: 3px; }
        }
      `}</style>
        </>
    );
}
