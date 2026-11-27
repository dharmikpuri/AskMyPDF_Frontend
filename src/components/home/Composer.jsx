import { useLayoutEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

const MAX_QUESTION = 2000;
const COUNTER_FROM = 1800;

export default function Composer({
  value,
  onChange,
  onSend,
  fileName,
  disabled, // no doc / session still loading
  pending,
  limitReached,
  onSignup,
}) {
  const ref = useRef(null);

  // Auto-grow: 1 to 6 rows (max-height in CSS caps it and enables scrolling).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  if (limitReached) {
    return (
      <div className="composer composer-locked">
        <span>Demo limit reached &mdash; sign up to keep chatting</span>
        <button type="button" className="btn btn-primary btn-sm" onClick={onSignup}>
          Sign up free
        </button>
      </div>
    );
  }

  const canSend = !!value.trim() && !disabled && !pending;

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <label htmlFor="question" className="visually-hidden">
          Your question
        </label>
        <textarea
          id="question"
          ref={ref}
          rows={1}
          value={value}
          maxLength={MAX_QUESTION}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          // A placeholder can't ellipsize inside a 1-row textarea (it wraps out of view on
          // phones), so long file names fall back to a short generic prompt.
          placeholder={
            !fileName
              ? "Select a document to start\u2026"
              : fileName.length > 24
                ? "Ask about this document\u2026"
                : `Ask about ${fileName}\u2026`
          }
          disabled={disabled}
        />
        <button
          type="button"
          className="send-btn"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send question"
        >
          {pending ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <ArrowUp size={18} />}
        </button>
      </div>
      {value.length > COUNTER_FROM && (
        <div className={`counter mono${value.length >= MAX_QUESTION ? " counter-max" : ""}`} aria-live="polite">
          {value.length} / {MAX_QUESTION}
        </div>
      )}
    </div>
  );
}