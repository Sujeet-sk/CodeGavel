function BrandMark({ compact = false }) {
  return (
    <div className={`cg-brand ${compact ? "cg-brand-compact" : ""}`}>
      <div className="cg-mark" aria-label="CodeGavel">
        <svg viewBox="0 0 48 48" role="img">
          <circle
            className="cg-mark-pulse"
            cx="24"
            cy="24"
            r="18"
          />

          <path
            className="cg-mark-ring"
            d="M24 5a19 19 0 1 0 19 19"
          />

          <g className="cg-mark-gavel-group">
            <path
              className="cg-mark-gavel"
              d="M16 18l10 10"
            />

            <path
              className="cg-mark-head"
              d="M13 15l6-6 14 14-6 6z"
            />
          </g>

          <path
            className="cg-mark-strike"
            d="M11 37h26"
          />
        </svg>
      </div>

      {!compact && (
        <div className="cg-brand-word">
          Code<span>Gavel</span>
        </div>
      )}
    </div>
  );
}

export default BrandMark;
