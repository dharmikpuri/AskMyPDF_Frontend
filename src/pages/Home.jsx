import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/config";
import { toast } from "react-toastify";
import Theme from "./Theme";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messagesByDocId, setMessagesByDocId] = useState({});
  const [pdf, setPdf] = useState(null);
  const [pendingByDocId, setPendingByDocId] = useState({});
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [sessionByDocId, setSessionByDocId] = useState(() => {
    try {
      const raw = localStorage.getItem("chatSessionsByDoc");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [docsLoad, setDocsLoad] = useState(false);
  const [deletingId, setDelId] = useState(null);
  const [sessionLoadingByDocId, setSessionLoadingByDocId] = useState({});
  const [userName, setUserName] = useState("User");
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    onConfirm: null,
  });
  const endRef = useRef(null);
  const lastSendAtByDocIdRef = useRef({});
  const activeMessages = selected ? messagesByDocId[selected.documentId] || [] : [];
  const isActivePending = selected ? !!pendingByDocId[selected.documentId] : false;
  const isActiveSessionLoading = selected
    ? !!sessionLoadingByDocId[selected.documentId]
    : false;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.name) setUserName(parsed.name);
      } catch {
        /* ignore parse errors */
      }
    }
    fetchDocs();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isActivePending]);

  useEffect(() => {
    try {
      localStorage.setItem("chatSessionsByDoc", JSON.stringify(sessionByDocId));
    } catch {
      /* ignore storage errors */
    }
  }, [sessionByDocId]);

  const fetchDocs = async () => {
    try {
      setDocsLoad(true);
      const r = await apiClient.get("/documents");
      if (r.data.success) setDocuments(r.data.documents);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load documents");
    } finally {
      setDocsLoad(false);
    }
  };

  const fetchChats = async (documentId, sessionId) => {
    try {
      if (!documentId) {
        return;
      }
      if (!sessionId) {
        setMessagesByDocId((prev) => ({ ...prev, [documentId]: [] }));
        return;
      }
      const r = await apiClient.get("/chats", {
        params: { documentId, chatSessionId: sessionId },
      });
      const history = normalizeChatHistory(r.data);
      if (Array.isArray(history)) {
        setMessagesByDocId((prev) => ({ ...prev, [documentId]: history }));
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to load chat history");
    }
  };

  const createChatSession = async (documentId) => {
    try {
      setSessionLoadingByDocId((prev) => ({ ...prev, [documentId]: true }));
      if (sessionByDocId[documentId]) {
        const existing = sessionByDocId[documentId];
        setChatSessionId(existing);
        return existing;
      }
      const r = await apiClient.post("/chat/session", { documentId });
      const sessionId = r.data?.chatSessionId || null;
      if (!sessionId) throw new Error("Missing chatSessionId");
      setChatSessionId(sessionId);
      setSessionByDocId((prev) => ({ ...prev, [documentId]: sessionId }));
      return sessionId;
    } catch (e) {
      console.log(e);
      toast.error("Failed to create chat session");
      return null;
    } finally {
      setSessionLoadingByDocId((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  const normalizeChatHistory = (data) => {
    const list = data?.messages || data?.chats || data || [];
    if (!Array.isArray(list)) return [];
    if (list.length === 0) return [];
    if (list[0]?.role && list[0]?.text) return list;
    if (list[0]?.message?.role && list[0]?.message?.text) {
      return list.map((item) => item.message).filter(Boolean);
    }
    return list
      .filter((item) => item?.role && item?.text)
      .map((item) => ({ role: item.role, text: item.text }));
  };

  const openConfirm = ({ title, message, confirmLabel, onConfirm }) => {
    setConfirmState({
      open: true,
      title,
      message,
      confirmLabel: confirmLabel || "Confirm",
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, open: false, onConfirm: null }));
  };

  const clearChat = async () => {
    if (!selected?.documentId) {
      toast.info("Select a document first");
      return;
    }
    if (!chatSessionId) {
      toast.info("No active chat session");
      return;
    }
    openConfirm({
      title: "Clear chat history",
      message:
        "This will remove all messages for the selected document. This cannot be undone.",
      confirmLabel: "Clear chat",
      onConfirm: async () => {
        try {
          await apiClient.delete("/chats", {
            params: {
              documentId: selected.documentId,
              chatSessionId,
            },
          });
          setMessagesByDocId((prev) => ({ ...prev, [selected.documentId]: [] }));
          toast.success("Chat cleared");
        } catch (e) {
          console.log(e);
          toast.error("Clear chat failed");
        }
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("Logged out");
  };

  const uploadPdf = async () => {
    if (!pdf) {
      toast.info("Choose a PDF to upload");
      return;
    }
    try {
      setUploading(true);
      setStatus(null);
      const fd = new FormData();
      fd.append("pdf", pdf);
      const r = await apiClient.post("/upload-pdf", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (r.data.success) {
        setStatus("ok");
        setPdf(null);
        await fetchDocs();
        const nextDoc = {
          documentId: r.data.documentId,
          fileName: r.data.fileName,
        };
        setSelected(nextDoc);
        const sessionId = await createChatSession(nextDoc.documentId);
        if (sessionId) fetchChats(nextDoc.documentId, sessionId);
        toast.success("PDF indexed successfully");
      }
    } catch (e) {
      console.log(e);
      setStatus("fail");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectDoc = (doc) => {
    const run = async () => {
      setSelected(doc);
      setStatus(null);
      const existingSessionId = sessionByDocId[doc.documentId] || null;
      setChatSessionId(existingSessionId);
      const sessionId = await createChatSession(doc.documentId);
      if (sessionId) fetchChats(doc.documentId, sessionId);
    };
    run();
  };

  const deleteDoc = async (e, doc) => {
    e.stopPropagation();
    openConfirm({
      title: "Delete PDF",
      message: `Delete "${doc.fileName}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          setDelId(doc.documentId);
          await apiClient.delete(`/documents/${doc.documentId}`);
          if (selected?.documentId === doc.documentId) {
            setSelected(null);
            setChatSessionId(null);
          }
          setSessionByDocId((prev) => {
            const next = { ...prev };
            delete next[doc.documentId];
            return next;
          });
          setMessagesByDocId((prev) => {
            const next = { ...prev };
            delete next[doc.documentId];
            return next;
          });
          setPendingByDocId((prev) => {
            const next = { ...prev };
            delete next[doc.documentId];
            return next;
          });
          setSessionLoadingByDocId((prev) => {
            const next = { ...prev };
            delete next[doc.documentId];
            return next;
          });
          await fetchDocs();
          toast.success("Document deleted");
        } catch (e) {
          console.log(e);
          toast.error("Delete failed");
        } finally {
          setDelId(null);
        }
      },
    });
  };

  const send = async () => {
    const now = Date.now();
    let activeDocumentId;
    if (!message.trim()) {
      toast.info("Type a question first");
      return;
    }
    if (!selected) {
      toast.info("Select a document first");
      return;
    }
    if (!chatSessionId) {
      toast.info("No active chat session");
      return;
    }
    if (isActivePending) return;
    activeDocumentId = selected.documentId;
    const lastSendAt = lastSendAtByDocIdRef.current[activeDocumentId] || 0;
    if (now - lastSendAt < 400) return;
    try {
      lastSendAtByDocIdRef.current[activeDocumentId] = now;
      const q = message;
      const activeSessionId = chatSessionId;
      setMessage("");
      setMessagesByDocId((prev) => {
        const next = { ...prev };
        const current = next[activeDocumentId] || [];
        next[activeDocumentId] = [...current, { role: "user", text: q }];
        return next;
      });
      setPendingByDocId((prev) => ({ ...prev, [activeDocumentId]: true }));
      const r = await apiClient.post("/ask-pdf", {
        question: q,
        documentId: activeDocumentId,
      });
      const aiText = r.data?.answer || r.data?.reply || "";
      if (!aiText) {
        toast.error("No response from AI");
        setPendingByDocId((prev) => ({ ...prev, [activeDocumentId]: false }));
        return;
      }
      setMessagesByDocId((prev) => {
        const next = { ...prev };
        const current = next[activeDocumentId] || [];
        next[activeDocumentId] = [...current, { role: "ai", text: aiText }];
        return next;
      });
      setPendingByDocId((prev) => ({ ...prev, [activeDocumentId]: false }));

      apiClient.post("/chat", {
        documentId: activeDocumentId,
        chatSessionId: activeSessionId,
        saveOnly: true,
        reply: aiText,
        messages: [
          { role: "user", text: q },
          { role: "ai", text: aiText },
        ],
      }).catch((err) => {
        console.log(err);
        toast.error("Failed to save chat");
      });
    } catch (e) {
      console.log(e);
      toast.error("Failed to get response");
    } finally {
      if (activeDocumentId) {
        setPendingByDocId((prev) => ({ ...prev, [activeDocumentId]: false }));
      }
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <Theme />
      <div className="shell">
        {/* TOPBAR */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="logo">✦ AskMyPDF</span>
            {/* <span className="logo-sub">RAG · PDF</span> */}
          </div>
          <div className="top-right">
            <span className="live-dot" /> gemini-embedding-2 · mongodb atlas
          </div>
        </header>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="up-section">
            <p className="sec-label">Upload PDF</p>
            <div className="drop">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setPdf(e.target.files[0] || null);
                  setStatus(null);
                }}
              />
              <span className="drop-ico">📄</span>
              {pdf ? (
                <div className="drop-name">{pdf.name}</div>
              ) : (
                <div className="drop-txt">
                  Click to choose a PDF
                  <br />
                  or drop it here
                </div>
              )}
            </div>

            {status === "ok" && (
              <span className="spill ok">
                {" "}
                <span className="sd" /> Indexed successfully
              </span>
            )}
            {status === "fail" && (
              <span className="spill fail">
                {" "}
                <span className="sd" /> Upload failed
              </span>
            )}
            {uploading && (
              <span className="spill busy">
                {" "}
                <span className="sd blink" /> Processing chunks…
              </span>
            )}

            <button
              className="up-btn"
              onClick={uploadPdf}
              disabled={!pdf || uploading}
            >
              {uploading ? "Uploading…" : "↑ Upload & Index"}
            </button>
          </div>

          <div className="docs-section">
            <div className="docs-head">
              <span className="sec-label" style={{ marginBottom: 0 }}>
                Your PDFs
              </span>
              <button
                className="refresh"
                onClick={fetchDocs}
                disabled={docsLoad}
                title="Refresh"
              >
                {docsLoad ? "…" : "↻"}
              </button>
            </div>
            <div className="doc-list">
              {documents.length === 0 && !docsLoad && (
                <div className="doc-empty">
                  <span className="doc-empty-icon">🗂</span>
                  No documents yet.
                  <br />
                  Upload a PDF above.
                </div>
              )}
              {documents.map((doc) => (
                <div
                  key={doc.documentId}
                  className={`doc-row ${selected?.documentId === doc.documentId ? "active" : ""}`}
                  onClick={() => selectDoc(doc)}
                >
                  <span className="doc-ico">📄</span>
                  <div className="doc-info">
                    <div className="doc-name" title={doc.fileName}>
                      {doc.fileName}
                    </div>
                    <div className="doc-meta">
                      {doc.totalChunks} chunks · {fmtDate(doc.createdAt)}
                    </div>
                  </div>
                  <button
                    className="del"
                    onClick={(e) => deleteDoc(e, doc)}
                    disabled={deletingId === doc.documentId}
                    title="Delete"
                  >
                    {deletingId === doc.documentId ? "…" : "✕"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="user-card">
            <div className="user-text">
              <span className="user-label">Welcome</span>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* CHAT */}
        <main className="chat">
          <div className="chat-hdr">
            <div>
              {selected ? (
                <span className="chat-hdr-pill">📄 {selected.fileName}</span>
              ) : (
                <span className="chat-hdr-none">
                  Select a document to start chatting
                </span>
              )}
            </div>
            <div className="chat-actions">
              {isActiveSessionLoading && (
                <span className="chat-hdr-none">Loading session…</span>
              )}
              <button
                className="clear-chat"
                onClick={clearChat}
                disabled={activeMessages.length === 0 || isActiveSessionLoading}
              >
                Clear Chat
              </button>
            </div>
          </div>

          {activeMessages.length === 0 && !isActivePending ? (
            <div className="msgs empty-state">
              <div className="empty-glow">✦</div>
              <div className="empty-title">
                {selected
                  ? `Ask anything about\n"${selected.fileName}"`
                  : "Open a PDF.\nAsk anything."}
              </div>
              <div className="empty-sub">
                {selected
                  ? "Answers come only from your document · Powered by Gemini"
                  : "Upload a PDF or select one from the sidebar\nto start your RAG conversation"}
              </div>
            </div>
          ) : (
            <div className="msgs">
              {activeMessages.map((msg, i) => (
                <div key={i} className={`mw ${msg.role}`}>
                  <div className={`av ${msg.role}`}>
                    {msg.role === "user" ? "You" : "AI"}
                  </div>
                  <div className={`bbl ${msg.role}`}>{msg.text}</div>
                </div>
              ))}
              {isActivePending && (
                <div className="mw ai">
                  <div className="av ai">AI</div>
                  <div className="bbl ai">
                    <div className="dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}

          <div className="inp-row">
            <div className="inp-wrap">
              <textarea
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKey}
                placeholder={
                  selected
                    ? `Ask about "${selected.fileName}"… (Enter to send)`
                    : "Select a document first…"
                }
                disabled={!selected || isActivePending || isActiveSessionLoading}
              />
            </div>
            <button
              className="send"
              onClick={send}
              disabled={!message.trim() || !selected || isActivePending || isActiveSessionLoading}
              title="Send"
            >
              ➤
            </button>
          </div>
        </main>
      </div>

      {confirmState.open && (
        <div className="modal-backdrop" onClick={closeConfirm}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={confirmState.title}
          >
            <div className="modal-kicker">Confirmation</div>
            <div className="modal-title">{confirmState.title}</div>
            <div className="modal-body">{confirmState.message}</div>
            <div className="modal-actions">
              <button className="modal-btn ghost" onClick={closeConfirm}>
                Cancel
              </button>
              <button
                className="modal-btn danger"
                onClick={async () => {
                  const handler = confirmState.onConfirm;
                  closeConfirm();
                  if (handler) await handler();
                }}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
