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

                {/* Radial bg glow */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 65%)",
                    pointerEvents: "none",
                }} />

                {/* Animated top glow line */}
                <div className="nf-glow-line" />

                {/* ── SINGLE ROW — always space-between, always centered ── */}
                <div className="nf-footer-row">

                    {/* LEFT — NUTRIFIT brand */}
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

                    {/* RIGHT — pill badges */}
                    <div className="nf-pills">
                        {[
                            { icon: "fa-dumbbell", label: "Fitness" },
                            { icon: "fa-utensils", label: "Nutrition" },
                            { icon: "fa-heart-pulse", label: "Health" },
                            { icon: "fa-chart-line", label: "Progress" },
                        ].map(({ icon, label }) => (
                            <span key={label} className="nf-pill">
                                <i className={`fa-solid ${icon} nf-pill-icon`} />
                                <span className="nf-pill-label">{label}</span>
                            </span>
                        ))}
                    </div>

                </div>
            </footer>

            <style>{`
        /* ── GLOW LINE ── */
        .nf-glow-line {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          height: 2px; border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent);
          box-shadow: 0 0 22px rgba(229,9,20,0.55);
          pointer-events: none;
          animation: nfGlowAnim 3s ease-in-out infinite;
        }
        @keyframes nfGlowAnim {
          0%, 100% { opacity: 0.55; width: 44%; }
          50%       { opacity: 1;   width: 62%; }
        }

        /* ── ROW — same height as navbar (~68px), always space-between+center ── */
        .nf-footer-row {
          display: flex;
          flex-wrap: nowrap;               /* never wrap — always single row */
          align-items: center;             /* vertically centered always */
          justify-content: space-between;  /* left | center | right always */
          min-height: 68px;                /* match navbar height */
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 28px;
          gap: 12px;
          box-sizing: border-box;
        }

        /* ── BRAND (left) ── */
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

        /* ── COPYRIGHT (center) ── */
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
        .nf-copy-year   { color: #606060; white-space: nowrap; }
        .nf-dot         { color: rgba(229,9,20,0.5); font-size: 0.42rem; }
        .nf-copy-label  { color: #909090; white-space: nowrap; }
        .nf-copy-author {
          color: #e50914;
          font-weight: 700;
          letter-spacing: 0.7px;
          white-space: nowrap;
          text-shadow: 0 0 12px rgba(229,9,20,0.4);
        }

        /* ── PILLS (right) ── */
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
          background: rgba(229,9,20,0.14);
          border-color: rgba(229,9,20,0.45);
          color: #ccc;
        }
        .nf-pill-icon  { color: rgba(229,9,20,0.7); font-size: 0.62rem; }
        .nf-pill-label { display: inline; }

        /* ════════════ RESPONSIVE — ONLY scale, NEVER hide ════════════ */

        /* ── TABLET (≤ 960px) ── */
        @media (max-width: 960px) {
          .nf-brand          { font-size: 1.25rem; letter-spacing: 4px; }
          .nf-copy           { font-size: 0.68rem; gap: 4px; }
          .nf-pill           { padding: 4px 9px;  font-size: 0.55rem; }
          .nf-pills          { gap: 5px; }
          .nf-footer-row     { padding: 0 20px; gap: 10px; }
        }

        /* ── SMALL TABLET (≤ 768px) ── */
        @media (max-width: 768px) {
          .nf-brand          { font-size: 1.05rem; letter-spacing: 3px; }
          .nf-copy           { font-size: 0.62rem; gap: 3px; }
          .nf-pill           { padding: 3px 8px;  font-size: 0.51rem; letter-spacing: 0.7px; }
          .nf-pills          { gap: 4px; }
          .nf-footer-row     { padding: 0 14px; gap: 8px; }
        }

        /* ── MOBILE (≤ 580px) ── */
        @media (max-width: 580px) {
          .nf-footer-row     { padding: 0 10px; gap: 6px; min-height: 56px; }
          .nf-brand          { font-size: 0.88rem; letter-spacing: 2px; }
          .nf-copy           { font-size: 0.56rem; gap: 3px; }
          .nf-pill           { padding: 3px 6px;  font-size: 0.47rem; letter-spacing: 0.4px; gap: 3px; }
          .nf-pills          { gap: 3px; }
          .nf-pill-icon      { font-size: 0.55rem; }
        }

        /* ── VERY SMALL (≤ 380px) ── */
        @media (max-width: 380px) {
          .nf-footer-row     { padding: 0 8px; gap: 4px; }
          .nf-brand          { font-size: 0.75rem; letter-spacing: 1.5px; }
          .nf-copy           { font-size: 0.5rem; }
          .nf-pill           { padding: 2px 5px; font-size: 0.43rem; }
        }
      `}</style>
        </>
    );
}
