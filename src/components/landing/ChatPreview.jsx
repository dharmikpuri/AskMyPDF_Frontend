import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const PAIRS = [
  {
    q: "What are the four functions of the AI RMF Core?",
    a: "**Govern**, **Map**, **Measure** and **Manage**.",
    source: "NIST AI Risk Management Framework",
  },
  {
    q: "How long is a senator's term?",
    a: "Each senator serves for **six years**.",
    source: "The U.S. Constitution",
  },
  {
    q: "How many days of annual leave do employees get?",
    a: "**24 working days** per year, accrued monthly.",
    source: "Northwind Labs \u2014 Employee Handbook",
  },
];

/** "**bold**" markup -> [{text, bold}] segments. */
const segments = (s) => s.split("**").map((text, i) => ({ text, bold: i % 2 === 1 }));
const plainLength = (s) => s.replace(/\*\*/g, "").length;

function Answer({ text, count }) {
  let left = count;
  return segments(text).map((seg, i) => {
    const part = seg.text.slice(0, Math.max(0, left));
    left -= seg.text.length;
    if (!part) return null;
    return seg.bold ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>;
  });
}

/** Pure HTML/CSS mock of the chat: loops through real sample Q&A pairs. Pauses on hover/focus. */
export default function ChatPreview() {
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [i, setI] = useState(0);
  const [n, setN] = useState(() => (reduced ? plainLength(PAIRS[0].a) : 0));
  const [paused, setPaused] = useState(false);

  const pair = PAIRS[i];
  const total = plainLength(pair.a);
  const done = n >= total;

  useEffect(() => {
    if (paused || reduced) return undefined;
    let t;
    if (!done) {
      t = setTimeout(() => setN((c) => c + 1), n === 0 ? 800 : 32);
    } else {
      t = setTimeout(() => {
        setI((c) => (c + 1) % PAIRS.length);
        setN(0);
      }, 4000);
    }
    return () => clearTimeout(t);
  }, [n, done, paused, reduced]);

  return (
    <div
      className="cp"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cp-bar" aria-hidden="true">
        <span /><span /><span />
        <em className="mono">AskMyPDF</em>
      </div>
      <div className="cp-body" aria-live="off">
        <div className="cp-user">{pair.q}</div>
        <div className="cp-ai">
          <span className="ai-avatar" aria-hidden="true">AI</span>
          <div className="cp-ai-main">
            <p className="cp-answer">
              {n === 0 ? (
                <span className="typing" aria-hidden="true"><span /><span /><span /></span>
              ) : (
                <Answer text={pair.a} count={n} />
              )}
              {done && <span className="cp-chip mono">[1]</span>}
            </p>
            <div className={`cp-source${done ? " cp-source-on" : ""}`}>
              <FileText size={14} aria-hidden="true" />
              <span className="mono">[1]</span>
              <span>{pair.source}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-dots" aria-hidden="true">
        {PAIRS.map((_, k) => (
          <span key={k} className={k === i ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}