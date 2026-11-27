import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { startDemo } from "../api/auth";
import { getToken, setAuth } from "../lib/session";

/**
 * Starts a guest demo session (or reuses an existing session) and opens the workspace.
 * `slow` flips on after 3 s so the UI can say the server is waking up.
 * `activeId` is the sample the user clicked (null for the generic demo button).
 */
export default function useStartDemo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const busyRef = useRef(false);

  const start = async (documentId, question) => {
    if (busyRef.current) return;
    const params = new URLSearchParams();
    if (documentId) params.set("doc", documentId);
    if (question) params.set("q", question);
    const qs = params.toString();
    const target = qs ? `/app?${qs}` : "/app";
    if (getToken()) {
      navigate(target);
      return;
    }
    busyRef.current = true;
    setLoading(true);
    setActiveId(documentId || null);
    const timer = setTimeout(() => setSlow(true), 3000);
    const result = await startDemo();
    clearTimeout(timer);
    busyRef.current = false;
    setLoading(false);
    setSlow(false);
    setActiveId(null);
    if (result?.success && result?.token) {
      setAuth({
        token: result.token,
        user: { ...result.user, isGuest: true, demo: result.demo },
      });
      navigate(target, { replace: true });
    } else {
      toast.error(result?.message || "The demo is unavailable right now.");
    }
  };

  return { start, loading, slow, activeId };
}