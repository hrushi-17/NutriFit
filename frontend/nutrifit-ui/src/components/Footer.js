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
                    background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.07) 0%, transparent 65%)",
                    pointerEvents: "none",
                }} />

                {/* Animated top glow line */}
                <div className="nf-glow-line" />

                {/* ── SINGLE ROW: Brand | Copyright | Pills ── */}
                <div className="nf-footer-row">

                    {/* LEFT — NUTRIFIT brand */}
                    <div className="nf-brand">
                        <span className="nf-brand-nutri">NUTRI</span>
                        <span className="nf-brand-fit">FIT</span>
                    </div>

                    {/* CENTER — full copyright (ALL content always visible) */}
                    <div className="nf-copy">
                        <span className="nf-copy-year">&copy; Copyright 2026</span>
                        <span className="nf-dot">&#9679;</span>
                        <span className="nf-copy-label">Designed and Developed by</span>
                        <span className="nf-copy-author">Hrushikesh Chothe</span>
                    </div>

                    {/* RIGHT — pill badges (all labels always visible) */}
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
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(229,9,20,0.6) 30%, #e50914 50%, rgba(229,9,20,0.6) 70%, transparent);
          box-shadow: 0 0 22px rgba(229,9,20,0.55);
          pointer-events: none;
          animation: nfGlowAnim 3s ease-in-out infinite;
        }
        @keyframes nfGlowAnim {
          0%, 100% { opacity: 0.55; width: 44%; }
          50%       { opacity: 1;   width: 62%; }
        }

        /* ── ROW ── */
        .nf-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 10px;
          max-width: 1300px;
          margin: 0 auto;
          padding: 13px 24px;
        }

        /* ── BRAND ── */
        .nf-brand {
          flex-shrink: 0;
          font-family: 'Bebas Neue', 'Roboto', sans-serif;
          font-size: 1.5rem;
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

        /* ── COPYRIGHT ── */
        .nf-copy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          font-family: 'Roboto', sans-serif;
          font-size: 0.75rem;
          line-height: 1.5;
          text-align: center;
        }
        .nf-copy-year   { color: #606060; white-space: nowrap; }
        .nf-dot         { color: rgba(229,9,20,0.5); font-size: 0.4rem; line-height: 1; }
        .nf-copy-label  { color: #909090; white-space: nowrap; }
        .nf-copy-author {
          color: #e50914;
          font-weight: 700;
          letter-spacing: 0.7px;
          white-space: nowrap;
          text-shadow: 0 0 12px rgba(229,9,20,0.4);
        }

        /* ── PILLS ── */
        .nf-pills {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: nowrap;
        }
        .nf-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(229,9,20,0.07);
          border: 1px solid rgba(229,9,20,0.2);
          border-radius: 20px;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #777;
          white-space: nowrap;
        }
        .nf-pill-icon  { color: rgba(229,9,20,0.7); font-size: 0.6rem; }
        .nf-pill-label { display: inline; }

        /* ── TABLET (≤ 960px) — shrink proportionally, nothing hidden ── */
        @media (max-width: 960px) {
          .nf-brand        { font-size: 1.15rem; letter-spacing: 3px; }
          .nf-copy         { font-size: 0.67rem; gap: 4px; }
          .nf-pill         { padding: 3px 8px; font-size: 0.54rem; }
          .nf-pills        { gap: 4px; }
        }

        /* ── SMALL TABLET (≤ 768px) ── */
        @media (max-width: 768px) {
          .nf-footer-row   { padding: 12px 16px; gap: 8px; flex-wrap: wrap; }
          .nf-brand        { font-size: 1.05rem; letter-spacing: 2.5px; flex: 0 0 auto; }
          .nf-copy         { font-size: 0.62rem; flex: 1 1 100%; order: 3; justify-content: center; }
          .nf-pills        { flex: 0 0 auto; gap: 4px; }
          .nf-pill         { padding: 3px 7px; font-size: 0.51rem; }
        }

        /* ── MOBILE (≤ 560px) ── */
        @media (max-width: 560px) {
          .nf-footer-row   { padding: 10px 12px; gap: 6px; }
          .nf-brand        { font-size: 0.9rem; letter-spacing: 2px; }
          .nf-copy         { font-size: 0.58rem; gap: 3px; }
          .nf-pill         { padding: 3px 6px; font-size: 0.49rem; letter-spacing: 0.5px; }
          .nf-pills        { gap: 3px; }
        }

        /* ── VERY SMALL (≤ 380px) ── */
        @media (max-width: 380px) {
          .nf-brand        { font-size: 0.78rem; letter-spacing: 1.5px; }
          .nf-copy         { font-size: 0.52rem; }
          .nf-pill         { padding: 2px 5px; font-size: 0.45rem; }
        }
      `}</style>
        </>
    );
}
