import { useId, useState } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, CircleAlert, Copy, Info, RotateCw } from "lucide-react";
import Markdown from "./Markdown";
import Sources from "./Sources";
import { isNotFoundAnswer } from "../../lib/format";

export default function Message({ msg, canRetry, onRetry }) {
  const [showSources, setShowSources] = useState(false);
  const sourcesId = useId();

  if (msg.role === "user") {
    return (
      <div className="msg msg-user">
        <div className="bubble">{msg.text}</div>
        {msg.error && (
          <div className="msg-error" role="alert">
            <CircleAlert size={14} aria-hidden="true" />
            <span>{msg.errorText || "Couldn\u2019t get an answer"} &mdash;</span>
            <button
              type="button"
              className="link-btn link-btn-danger"
              onClick={() => onRetry(msg.id)}
              disabled={!canRetry}
            >
              <RotateCw size={13} aria-hidden="true" /> Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  const notFound = isNotFoundAnswer(msg.text);
  const sources = Array.isArray(msg.sources) ? msg.sources : [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      toast.success("Copied");
    } catch {
      toast.error("Couldn't copy to the clipboard");
    }
  };

  return (
    <div className="msg msg-ai">
      <span className="ai-avatar" aria-hidden="true">AI</span>
      <div className="msg-body">
        {notFound ? (
          <p className="note-info">
            <Info size={16} aria-hidden="true" />
            <span>{msg.text}</span>
          </p>
        ) : (
          <>
            <Markdown>{msg.text}</Markdown>
            <div className="msg-actions">
              <button type="button" className="action-btn" onClick={copy}>
                <Copy size={14} aria-hidden="true" /> Copy
              </button>
              {sources.length > 0 && (
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setShowSources((v) => !v)}
                  aria-expanded={showSources}
                  aria-controls={sourcesId}
                >
                  Sources ({sources.length})
                  {showSources ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                </button>
              )}
            </div>
            {showSources && sources.length > 0 && <Sources id={sourcesId} sources={sources} />}
          </>
        )}
      </div>
    </div>
  );
}
