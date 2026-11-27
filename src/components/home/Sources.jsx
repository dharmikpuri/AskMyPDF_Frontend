import { useState } from "react";

const LONG_SNIPPET = 260;

function SourceCard({ source, position }) {
  const [expanded, setExpanded] = useState(false);
  const text = source.text || "";
  const isLong = text.length > LONG_SNIPPET || text.split("\n").length > 4;
  const pct = Number.isFinite(source.score) ? Math.round(source.score * 100) : null;

  return (
    <li className="source-card">
      <div className="source-head">
        <span className="source-badge mono">[{source.index ?? position}]</span>
        {pct !== null && <span className="source-score mono">{pct}% match</span>}
      </div>
      <p className={`source-text${isLong && !expanded ? " source-text-clamped" : ""}`}>{text}</p>
      {isLong && (
        <button type="button" className="link-btn" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </li>
  );
}

export default function Sources({ id, sources }) {
  return (
    <ol className="sources" id={id}>
      {sources.map((s, i) => (
        <SourceCard key={s.index ?? i} source={s} position={i + 1} />
      ))}
    </ol>
  );
}
