import { useEffect, useRef, useState } from "react";
import { ArrowDown, Eraser, FileText } from "lucide-react";
import Message from "./Message";
import TypingDots from "./TypingDots";
import Composer from "./Composer";
import Wordmark from "../Wordmark";
import WorkspaceIllustration from "../illustrations/WorkspaceIllustration";
import EmptyChatIllustration from "../illustrations/EmptyChatIllustration";

const DOC_SUGGESTIONS = [
  "Summarize this document in 5 bullet points",
  "What are the key takeaways?",
  "List any dates, numbers or deadlines mentioned",
];

const NEAR_BOTTOM_PX = 120;

function GuestBanner({ demo, onSignup }) {
  const low = demo.remaining <= 1;
  return (
    <div className={`guest-banner${low ? " guest-banner-warn" : ""}`}>
      <span>
        <strong>
          Demo &middot; {demo.remaining} of {demo.questionLimit} free questions left
        </strong>{" "}
        &mdash; Sign up to keep chatting and upload more PDFs.
      </span>
      <button type="button" className="guest-banner-link" onClick={onSignup}>
        Sign up free
      </button>
    </div>
  );
}

export default function ChatPane({
  selected,
  booting,
  messages, // undefined while history is loading
  pending,
  sessionLoading,
  isGuest,
  demo,
  limitReached,
  canClear,
  message,
  onMessageChange,
  onSend,
  onAsk,
  onRetry,
  onClear,
  onSignup,
}) {
  const scrollRef = useRef(null);
  const nearBottomRef = useRef(true);
  const forceScrollRef = useRef(false);
  const prevCountRef = useRef(0);
  const [showJump, setShowJump] = useState(false);

  const selectedId = selected?.documentId;
  const list = messages || [];
  const count = list.length;
  const lastRole = count ? list[count - 1].role : null;
  const loading = !!selected && messages === undefined;

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // New document: start at the bottom.
  useEffect(() => {
    forceScrollRef.current = true;
  }, [selectedId]);

  // New content: follow only if the reader is already near the bottom,
  // or the user just sent a message, or a document was just opened.
  useEffect(() => {
    const justSent = lastRole === "user" && count > prevCountRef.current;
    prevCountRef.current = count;
    if (forceScrollRef.current || nearBottomRef.current || justSent) {
      scrollToBottom();
      if (messages !== undefined) forceScrollRef.current = false;
    }
  }, [messages, pending, selectedId, lastRole, count]);
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    nearBottomRef.current = near;
    setShowJump(!near);
  };

  const suggestions =
    Array.isArray(selected?.suggestions) && selected.suggestions.length ? selected.suggestions : DOC_SUGGESTIONS;
  const composerDisabled = !selected || sessionLoading || loading;

  return (
    <main className="chat">
      <div className="chat-header">
        <div className="chat-title">
          {selected ? (
            <>
              <FileText size={16} aria-hidden="true" />
              <span className="chat-title-text" title={selected.fileName}>
                {selected.fileName}
              </span>
            </>
          ) : (
            <span className="muted">No document selected</span>
          )}
        </div>
        {!isGuest && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClear}
            disabled={!canClear}
          >
            <Eraser size={16} aria-hidden="true" /> Clear chat
          </button>
        )}
      </div>

      <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
        {booting && !selected ? (
          <div className="boot" role="status" aria-label="Loading your workspace">
            <Wordmark />
          </div>
        ) : !selected ? (
          <div className="empty">
            <WorkspaceIllustration />
            <h2 className="empty-title">Upload a PDF or pick one from the sidebar</h2>
          </div>
        ) : loading ? (
          <div className="chat-col" role="status" aria-label="Loading conversation">
            <div className="sk-user skeleton" style={{ width: "46%" }} />
            <div className="sk-ai">
              <span className="skeleton sk-avatar" />
              <div className="sk-lines">
                <span className="skeleton skeleton-line" style={{ width: "92%" }} />
                <span className="skeleton skeleton-line" style={{ width: "78%" }} />
                <span className="skeleton skeleton-line" style={{ width: "40%" }} />
              </div>
            </div>
            <div className="sk-user skeleton" style={{ width: "34%" }} />
            <div className="sk-ai">
              <span className="skeleton sk-avatar" />
              <div className="sk-lines">
                <span className="skeleton skeleton-line" style={{ width: "86%" }} />
                <span className="skeleton skeleton-line" style={{ width: "58%" }} />
              </div>
            </div>
          </div>
        ) : count === 0 && !pending ? (
          <div className="empty">
            <EmptyChatIllustration />
            <h2 className="empty-title">
              Ask anything about <span className="empty-file">{selected.title || selected.fileName}</span>
            </h2>
            <div className="chips">
              {suggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chip"
                  onClick={() => onAsk(q)}
                  disabled={composerDisabled || limitReached}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-col">
            {list.map((m) => (
              <Message key={m.id} msg={m} canRetry={!pending && !limitReached} onRetry={onRetry} />
            ))}
            {pending && <TypingDots />}
          </div>
        )}
      </div>

      <div className="chat-footer">
        {showJump && selected && (
          <button
            type="button"
            className="jump-pill"
            onClick={() => {
              scrollToBottom();
              setShowJump(false);
            }}
          >
            <ArrowDown size={14} aria-hidden="true" /> Jump to latest
          </button>
        )}
        {isGuest && demo && !limitReached && <GuestBanner demo={demo} onSignup={onSignup} />}
        <Composer
          value={message}
          onChange={onMessageChange}
          onSend={onSend}
          fileName={selected?.fileName}
          disabled={composerDisabled}
          pending={pending}
          limitReached={limitReached}
          onSignup={onSignup}
        />
      </div>
    </main>
  );
}
