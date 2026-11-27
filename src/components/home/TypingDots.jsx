import { useEffect, useState } from "react";

const stageFor = (ms) => {
  if (ms < 1500) return "Searching the document\u2026";
  if (ms < 4000) return "Reading the best passages\u2026";
  return "Writing the answer\u2026";
};

/** Pending answer: honest, time-based status text plus the typing dots. */
export default function TypingDots() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - t0), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="msg msg-ai msg-pending">
      <span className="ai-avatar" aria-hidden="true">AI</span>
      <div className="msg-body">
        <div className="typing-status" role="status" aria-live="polite">
          <div className="typing" aria-hidden="true">
            <span /><span /><span />
          </div>
          <span className="typing-text">
            {stageFor(elapsed)}
            {elapsed > 15000 && " The free tier can be slow \u2014 still working."}
          </span>
        </div>
      </div>
    </div>
  );
}