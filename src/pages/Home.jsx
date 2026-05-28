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
  const [messages, setMessages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [docsLoad, setDocsLoad] = useState(false);
  const [deletingId, setDelId] = useState(null);
  const [userName, setUserName] = useState("User");
  const endRef = useRef(null);
  const isSendingRef = useRef(false);
  const lastSendAtRef = useRef(0);

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
  }, [messages, loading]);

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

  const fetchChats = async (documentId) => {
    try {
      if (!documentId) {
        setMessages([]);
        return;
      }
      const r = await apiClient.get("/chats", { params: { documentId } });
      const history = normalizeChatHistory(r.data);
      if (Array.isArray(history)) setMessages(history);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load chat history");
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

  const clearChat = async () => {
    if (!selected?.documentId) {
      toast.info("Select a document first");
      return;
    }
    if (!window.confirm("Clear chat history?")) return;
    try {
      await apiClient.delete("/chats", {
        params: { documentId: selected.documentId },
      });
      setMessages([]);
      toast.success("Chat cleared");
    } catch (e) {
      console.log(e);
      toast.error("Clear chat failed");
    }
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
        fetchChats(nextDoc.documentId);
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
    setSelected(doc);
    setStatus(null);
    fetchChats(doc.documentId);
  };

  const deleteDoc = async (e, doc) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${doc.fileName}"? This cannot be undone.`))
      return;
    try {
      setDelId(doc.documentId);
      await apiClient.delete(`/documents/${doc.documentId}`);
      if (selected?.documentId === doc.documentId) {
        setSelected(null);
        setMessages([]);
      }
      await fetchDocs();
      toast.success("Document deleted");
    } catch (e) {
      console.log(e);
      toast.error("Delete failed");
    } finally {
      setDelId(null);
    }
  };

  const send = async () => {
    const now = Date.now();
    if (!message.trim()) {
      toast.info("Type a question first");
      return;
    }
    if (!selected) {
      toast.info("Select a document first");
      return;
    }
    if (loading || isSendingRef.current) return;
    if (now - lastSendAtRef.current < 400) return;
    try {
      isSendingRef.current = true;
      lastSendAtRef.current = now;
      setLoading(true);
      const q = message;
      setMessage("");
      setMessages((p) => [...p, { role: "user", text: q }]);
      const r = await apiClient.post("/ask-pdf", {
        question: q,
        documentId: selected.documentId,
      });
      const aiText = r.data?.answer || r.data?.reply || "";
      if (!aiText) {
        toast.error("No response from AI");
      }
      setMessages((p) => [...p, { role: "ai", text: aiText }]);
      setLoading(false);

      apiClient.post("/chat", {
        documentId: selected.documentId,
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
      setLoading(false);
      isSendingRef.current = false;
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
              <button
                className="clear-chat"
                onClick={clearChat}
                disabled={messages.length === 0}
              >
                Clear Chat
              </button>
            </div>
          </div>

          {messages.length === 0 && !loading ? (
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
              {messages.map((msg, i) => (
                <div key={i} className={`mw ${msg.role}`}>
                  <div className={`av ${msg.role}`}>
                    {msg.role === "user" ? "You" : "AI"}
                  </div>
                  <div className={`bbl ${msg.role}`}>{msg.text}</div>
                </div>
              ))}
              {loading && (
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
                disabled={!selected || loading}
              />
            </div>
            <button
              className="send"
              onClick={send}
              disabled={!message.trim() || !selected || loading}
              title="Send"
            >
              ➤
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
