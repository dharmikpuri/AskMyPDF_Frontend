import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/config";
import { parseApiError } from "../api/errors";
import { clearSession, getSessions, getToken, getUser, setSessions, updateUser } from "../lib/session";
import { uid } from "../lib/format";
import Topbar from "../components/home/Topbar";
import Sidebar from "../components/home/Sidebar";
import ChatPane from "../components/home/ChatPane";
import DemoLimitModal from "../components/home/DemoLimitModal";
import ConfirmModal from "../components/ConfirmModal";

const SEND_GUARD_MS = 400;

const normalizeHistory = (data) => {
  const list = Array.isArray(data?.messages) ? data.messages : [];
  return list
    .filter((m) => m && m.role && typeof m.text === "string")
    .map((m) => ({
      id: uid(),
      role: m.role === "user" ? "user" : "ai",
      text: m.text,
      sources: Array.isArray(m.sources) ? m.sources : undefined,
    }));
};

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user] = useState(() => getUser());
  const isGuest = !!user?.isGuest;

  const [demo, setDemo] = useState(() => user?.demo || null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  // Per-document state so switching documents mid-answer keeps working.
  const [messagesByDocId, setMessagesByDocId] = useState({});
  const [pendingByDocId, setPendingByDocId] = useState({});
  const [sessionByDocId, setSessionByDocId] = useState(() => getSessions());
  const [sessionLoadingByDocId, setSessionLoadingByDocId] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Synchronous mirror of sessionByDocId: state reads inside async handlers can be stale.
  const sessionsRef = useRef(sessionByDocId);
  const docsRef = useRef([]);
  // Question handed over from the landing page (?q=): asked once, then stripped from the URL.
  const autoAskRef = useRef(searchParams.get("q"));
  const lastSendAtRef = useRef({});
  const sessionInflightRef = useRef({});
  const historyRequestedRef = useRef(new Set());
  const drawerToggleRef = useRef(null);
  const sidebarRef = useRef(null);

  const selectedId = selected?.documentId;
  const activeMessages = selectedId ? messagesByDocId[selectedId] : undefined;
  const activePending = selectedId ? !!pendingByDocId[selectedId] : false;
  const activeSessionLoading = selectedId ? !!sessionLoadingByDocId[selectedId] : false;
  const limitReached = isGuest && !!demo && demo.remaining <= 0;

  useEffect(() => {
    docsRef.current = documents;
  }, [documents]);

  // Persist doc -> chat-session map (only while a session exists, so logout isn't undone).
  useEffect(() => {
    if (getToken()) setSessions(sessionByDocId);
  }, [sessionByDocId]);

  // ---- Drawer (<960px): focus in on open, Escape closes, focus back on close ----
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const toggle = drawerToggleRef.current;
    sidebarRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [drawerOpen]);

  // ---- Sessions & history ----
  const storeSession = (documentId, sessionId) => {
    const next = { ...sessionsRef.current };
    if (sessionId) next[documentId] = sessionId;
    else delete next[documentId];
    sessionsRef.current = next;
    setSessionByDocId(next);
  };

  /** `fresh` bypasses the cached id. With `fresh`, a NOT_FOUND from the server is re-thrown (document is gone). */
  const ensureSession = async (documentId, { fresh = false } = {}) => {
    const existing = sessionsRef.current[documentId];
    if (existing && !fresh) return existing;
    if (sessionInflightRef.current[documentId]) return sessionInflightRef.current[documentId];

    const run = (async () => {
      setSessionLoadingByDocId((prev) => ({ ...prev, [documentId]: true }));
      try {
        const { data } = await apiClient.post("/chat/session", { documentId });
        const sessionId = data?.chatSessionId;
        if (!sessionId) throw new Error("Missing chatSessionId");
        storeSession(documentId, sessionId);
        return sessionId;
      } catch (e) {
        const err = parseApiError(e, "Couldn't start a chat session.");
        if (fresh && err.code === "NOT_FOUND") throw e;
        if (err.code === "NOT_FOUND") {
          reportMissingDoc(documentId, err.message);
        } else {
          toast.error(err.message);
        }
        return null;
      } finally {
        delete sessionInflightRef.current[documentId];
        setSessionLoadingByDocId((prev) => ({ ...prev, [documentId]: false }));
      }
    })();
    sessionInflightRef.current[documentId] = run;
    return run;
  };

  /** The document no longer exists server-side (deleted, or a guest upload that expired). */
  const reportMissingDoc = (documentId, serverMessage) => {
    const doc = docsRef.current.find((d) => d.documentId === documentId);
    toast.error(doc?.isGuestUpload ? "Your uploaded PDF has expired." : serverMessage);
    forgetDoc(documentId);
  };

  const loadHistory = async (documentId, sessionId) => {
    historyRequestedRef.current.add(documentId);
    try {
      const { data } = await apiClient.get("/chats", { params: { documentId, chatSessionId: sessionId } });
      setMessagesByDocId((prev) => ({ ...prev, [documentId]: normalizeHistory(data) }));
    } catch (e) {
      const { code, message: msg } = parseApiError(e, "Couldn't load chat history.");
      if (code === "NOT_FOUND") {
        // Stored session no longer exists server-side: forget it, start clean.
        storeSession(documentId, null);
      } else {
        toast.error(msg);
      }
      historyRequestedRef.current.delete(documentId);
      setMessagesByDocId((prev) => ({ ...prev, [documentId]: [] }));
    }
  };

  const selectDoc = async (doc) => {
    setSelected(doc);
    setDrawerOpen(false);
    const sessionId = await ensureSession(doc.documentId);
    if (sessionId && !historyRequestedRef.current.has(doc.documentId)) {
      await loadHistory(doc.documentId, sessionId);
    } else if (!sessionId) {
      setMessagesByDocId((prev) => (prev[doc.documentId] ? prev : { ...prev, [doc.documentId]: [] }));
    }
  };

  // ---- Documents ----
  const fetchDocs = async () => {
    const { data } = await apiClient.get("/documents");
    const list = Array.isArray(data?.documents) ? data.documents : [];
    setDocuments(list);
    return list;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchDocs();
        if (cancelled) return;
        const wanted = searchParams.get("doc");
        const target = (wanted && list.find((d) => d.documentId === wanted)) ||
          (isGuest ? list.find((d) => d.isDemo) || list[0] : null);
        if (target) selectDoc(target);
      } catch (e) {
        if (!cancelled) toast.error(parseApiError(e, "Failed to load documents.").message);
      } finally {
        if (!cancelled) setDocsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Mount-only: initial document load (and demo auto-select).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploaded = async (uploaded) => {
    toast.success(`PDF indexed — ${uploaded.totalChunks} ${uploaded.totalChunks === 1 ? "chunk" : "chunks"}`);
    if (uploaded.demo) {
      applyDemo({ uploadLimit: uploaded.demo.uploadLimit, uploadsUsed: uploaded.demo.uploadsUsed });
    }
    if (uploaded.searchReady === false) {
      toast.info("Indexed — search may take a few more seconds to warm up.");
    }
    let doc = {
      documentId: uploaded.documentId,
      fileName: uploaded.fileName,
      totalChunks: uploaded.totalChunks,
      createdAt: new Date().toISOString(),
      ...(isGuest ? { isGuestUpload: true, isDemo: false, expiresAt: uploaded.expiresAt } : {}),
    };
    try {
      const list = await fetchDocs();
      doc = list.find((d) => d.documentId === uploaded.documentId) || doc;
    } catch {
      setDocuments((prev) => [doc, ...prev]);
    }
    // Brand-new document: no history to fetch.
    historyRequestedRef.current.add(doc.documentId);
    setMessagesByDocId((prev) => ({ ...prev, [doc.documentId]: [] }));
    setSelected(doc);
    setDrawerOpen(false);
    await ensureSession(doc.documentId);
  };

  /** Drop every trace of a document from local state. */
  const forgetDoc = (documentId) => {
    setSelected((cur) => (cur?.documentId === documentId ? null : cur));
    const drop = (prev) => {
      const next = { ...prev };
      delete next[documentId];
      return next;
    };
    storeSession(documentId, null);
    setMessagesByDocId(drop);
    setPendingByDocId(drop);
    setSessionLoadingByDocId(drop);
    historyRequestedRef.current.delete(documentId);
    setDocuments((prev) => prev.filter((d) => d.documentId !== documentId));
  };

  const requestDelete = (doc) => {
    setConfirm({
      title: "Delete document",
      message: `Delete "${doc.fileName}" and its chats? This cannot be undone.`,
      confirmLabel: "Delete",
      busyLabel: "Deleting\u2026",
      onConfirm: async () => {
        setDeletingId(doc.documentId);
        try {
          await apiClient.delete(`/documents/${doc.documentId}`);
          forgetDoc(doc.documentId);
          toast.success("Document deleted");
        } catch (e) {
          toast.error(parseApiError(e, "Delete failed.").message);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const requestClear = () => {
    if (!selected) return;
    const documentId = selected.documentId;
    const chatSessionId = sessionsRef.current[documentId];
    if (!chatSessionId) {
      toast.info("No active chat session");
      return;
    }
    setConfirm({
      title: "Clear chat",
      message: "This removes all messages for this document. This cannot be undone.",
      confirmLabel: "Clear chat",
      busyLabel: "Clearing\u2026",
      onConfirm: async () => {
        try {
          await apiClient.delete("/chats", { params: { documentId, chatSessionId } });
          setMessagesByDocId((prev) => ({ ...prev, [documentId]: [] }));
          toast.success("Chat cleared");
        } catch (e) {
          toast.error(parseApiError(e, "Couldn't clear the chat.").message);
        }
      },
    });
  };

  // ---- Asking ----
  const applyDemo = (info) => {
    const merged = { ...(demo || {}), ...info };
    setDemo(merged);
    updateUser({ demo: merged });
    return merged;
  };

  const patchMessage = (documentId, id, patch) =>
    setMessagesByDocId((prev) => ({
      ...prev,
      [documentId]: (prev[documentId] || []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));

  /** Returns true if the question was actually sent. `retryId` re-sends an existing failed message. */
  const ask = async (rawQuestion, retryId) => {
    const question = rawQuestion.trim();
    if (!question || !selected || activePending || limitReached) return false;

    const documentId = selected.documentId;
    const now = Date.now();
    // The guard stops accidental double-sends of NEW questions. A Retry is a deliberate action
    // and can legitimately follow a failure within milliseconds (e.g. offline), so it skips it.
    if (!retryId && now - (lastSendAtRef.current[documentId] || 0) < SEND_GUARD_MS) return false;
    lastSendAtRef.current[documentId] = now;

    setPendingByDocId((prev) => ({ ...prev, [documentId]: true }));

    const userId = retryId || uid();
    if (retryId) {
      patchMessage(documentId, retryId, { error: false });
    } else {
      setMessagesByDocId((prev) => ({
        ...prev,
        [documentId]: [...(prev[documentId] || []), { id: userId, role: "user", text: question }],
      }));
    }

    try {
      let chatSessionId = await ensureSession(documentId);
      if (!chatSessionId) throw new Error("no-session");

      let data;
      try {
        ({ data } = await apiClient.post("/ask-pdf", { question, documentId, chatSessionId }));
      } catch (e) {
        if (parseApiError(e).code !== "NOT_FOUND") throw e;
        // Stored chat session is gone server-side: drop it, make a new one, retry once silently.
        storeSession(documentId, null);
        chatSessionId = await ensureSession(documentId, { fresh: true }); // throws NOT_FOUND if the document is gone
        if (!chatSessionId) throw new Error("no-session", { cause: e });
        ({ data } = await apiClient.post("/ask-pdf", { question, documentId, chatSessionId }));
      }
      setMessagesByDocId((prev) => ({
        ...prev,
        [documentId]: [
          ...(prev[documentId] || []),
          { id: uid(), role: "ai", text: data?.answer || "", sources: data?.sources || [] },
        ],
      }));
      if (data?.demo) {
        const merged = applyDemo(data.demo);
        if (merged.remaining <= 0) setLimitModalOpen(true);
      }
    } catch (e) {
      const { code, message: msg } = parseApiError(e, "Couldn't get an answer.");
      if (e?.message === "no-session") {
        patchMessage(documentId, userId, { error: true }); // ensureSession already toasted
      } else if (code === "NOT_FOUND") {
        // Document itself no longer exists.
        reportMissingDoc(documentId, msg);
      } else if (code === "DEMO_LIMIT") {
        // Out of free questions: drop the unanswered message and show the upsell.
        setMessagesByDocId((prev) => ({
          ...prev,
          [documentId]: (prev[documentId] || []).filter((m) => m.id !== userId),
        }));
        applyDemo({ remaining: 0 });
        setLimitModalOpen(true);
      } else {
        const showInline = code === "AI_UNAVAILABLE" || code === "RATE_LIMITED";
        patchMessage(documentId, userId, { error: true, errorText: showInline ? msg : undefined });
        if (!showInline) toast.error(msg);
      }
    } finally {
      setPendingByDocId((prev) => ({ ...prev, [documentId]: false }));
    }
    return true;
  };

  // Auto-ask the ?q= question once the target document and its history are ready.
  useEffect(() => {
    const q = autoAskRef.current;
    if (!q || docsLoading || !selected || activeMessages === undefined || activePending) return;
    autoAskRef.current = null;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        return next;
      },
      { replace: true }
    );
    if (isGuest && !limitReached) ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docsLoading, selected, activeMessages, activePending]);

  const send = async () => {
    const text = message;
    if (await ask(text)) setMessage((cur) => (cur === text ? "" : cur));
  };

  const retry = (messageId) => {
    const msg = (messagesByDocId[selectedId] || []).find((m) => m.id === messageId);
    if (msg) ask(msg.text, messageId);
  };

  // ---- Session exits ----
  const leaveTo = (path) => {
    clearSession();
    navigate(path, { replace: true });
  };

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
    toast.info("Logged out");
  };

  return (
    <div className={`home${drawerOpen ? " home-drawer-open" : ""}`}>
      <Topbar
        user={user}
        isGuest={isGuest}
        drawerOpen={drawerOpen}
        drawerToggleRef={drawerToggleRef}
        onToggleDrawer={() => setDrawerOpen((v) => !v)}
        onLogout={logout}
        onSignup={() => leaveTo("/signup")}
      />

      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

      <Sidebar
        id="sidebar"
        asideRef={sidebarRef}
        isGuest={isGuest}
        demo={demo}
        documents={documents}
        loading={docsLoading}
        selectedId={selectedId}
        pendingByDocId={pendingByDocId}
        deletingId={deletingId}
        onSelect={selectDoc}
        onDelete={requestDelete}
        onUploaded={handleUploaded}
        onUploadLimit={() => applyDemo({ uploadsUsed: demo?.uploadLimit ?? 1 })}
        onSignup={() => leaveTo("/signup")}
      />

      <ChatPane
        selected={selected}
        booting={docsLoading}
        messages={activeMessages}
        pending={activePending}
        sessionLoading={activeSessionLoading}
        isGuest={isGuest}
        demo={demo}
        limitReached={limitReached}
        canClear={!!selected && !activeSessionLoading && (activeMessages?.length || 0) > 0 && !activePending}
        message={message}
        onMessageChange={setMessage}
        onSend={send}
        onAsk={ask}
        onRetry={retry}
        onClear={requestClear}
        onSignup={() => leaveTo("/signup")}
      />

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          busyLabel={confirm.busyLabel}
          onCancel={() => setConfirm(null)}
          onConfirm={async () => {
            await confirm.onConfirm();
            setConfirm(null);
          }}
        />
      )}

      {limitModalOpen && (
        <DemoLimitModal
          onSignup={() => leaveTo("/signup")}
          onLogin={() => leaveTo("/login")}
          onClose={() => setLimitModalOpen(false)}
        />
      )}
    </div>
  );
}
