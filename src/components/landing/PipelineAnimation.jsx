/**
 * Hero visual: the RAG story on a ~9 s loop, in pure SVG + CSS keyframes (see landing.css).
 * Without animation (reduced motion) the base styles are the final composed frame.
 */
const CHUNKS = [
  { y: 24, bars: [10, 22, 14, 26, 18] },
  { y: 98, bars: [24, 12, 26, 16, 22] },
  { y: 172, bars: [14, 26, 10, 20, 12] },
];

export default function PipelineAnimation() {
  return (
    <svg
      className="pipeline"
      viewBox="0 0 520 420"
      role="img"
      aria-label="Animation: a PDF is split into passages, each passage becomes a vector, your question finds the best-matching passage, and an answer appears with a citation to it."
    >
      <g>
        {/* PDF page */}
        <g className="pa-page">
          <rect x="14" y="24" width="124" height="170" rx="10" className="pa-card" />
          <path d="M14 34a10 10 0 0 1 10-10h50l22 22" fill="none" className="pa-stroke" />
          {[56, 74, 92, 110, 128, 146, 164].map((y, i) => (
            <rect key={y} x="30" y={y} width={i % 3 === 2 ? 62 : 92} height="6" rx="3" className="pa-line" />
          ))}
        </g>

        {/* Chunks */}
        {CHUNKS.map((c, i) => (
          <g key={c.y} className={`pa-chunk pa-chunk-${i + 1}`}>
            <rect x="196" y={c.y} width="170" height="62" rx="10" className="pa-card" />
            <rect x="210" y={c.y + 14} width="80" height="6" rx="3" className="pa-line" />
            <rect x="210" y={c.y + 28} width="108" height="6" rx="3" className="pa-line" />
            <rect x="210" y={c.y + 42} width="64" height="6" rx="3" className="pa-line" />
            <g className={`pa-vec pa-vec-${i + 1}`}>
              {c.bars.map((h, b) => (
                <rect key={b} x={326 + b * 7} y={c.y + 50 - h} width="4" height={h} rx="2" className="pa-bar" />
              ))}
            </g>
            {i === 0 && (
              <text x="344" y="16" textAnchor="middle" className="pa-label">Vectors</text>
            )}
          </g>
        ))}
        <path d="M142 109c20 0 30-60 50-60M142 109h50M142 109c20 0 30 60 50 60" fill="none" className="pa-stroke pa-split" />
        <text x="76" y="212" textAnchor="middle" className="pa-label">PDF</text>
        <text x="281" y="254" textAnchor="middle" className="pa-label">Passages</text>

        {/* Best match highlight */}
        <rect x="196" y="98" width="170" height="62" rx="10" className="pa-hit" />

        {/* Query */}
        <g className="pa-query">
          <rect x="14" y="248" width="150" height="46" rx="14" className="pa-card" />
          <circle cx="40" cy="271" r="12" className="pa-accent-fill" />
          <text x="40" y="276" textAnchor="middle" className="pa-q">?</text>
          <rect x="62" y="263" width="84" height="6" rx="3" className="pa-line" />
          <rect x="62" y="276" width="56" height="6" rx="3" className="pa-line" />
          <text x="89" y="310" textAnchor="middle" className="pa-label">Question</text>
        </g>
        <path d="M164 271C260 271 284 190 366 129" fill="none" className="pa-link" />

        {/* Answer */}
        <g className="pa-answer">
          <rect x="196" y="316" width="310" height="86" rx="14" className="pa-card pa-card-accent" />
          <rect x="214" y="334" width="250" height="7" rx="3.5" className="pa-text pa-text-1" />
          <rect x="214" y="351" width="270" height="7" rx="3.5" className="pa-text pa-text-2" />
          <rect x="214" y="368" width="150" height="7" rx="3.5" className="pa-text pa-text-3" />
          <text x="351" y="416" textAnchor="middle" className="pa-label">Answer + source</text>
          <g className="pa-chip">
            <rect x="372" y="358" width="38" height="24" rx="12" className="pa-accent-fill" />
            <text x="391" y="374" textAnchor="middle" className="pa-chip-text">[1]</text>
          </g>
        </g>
      </g>
    </svg>
  );
}