import { useEffect, useState } from "react";
import apiClient from "../api/config";

const WAKE_DELAY_MS = 2500;
const HEALTH_TIMEOUT_MS = 90000;

/** Slim top banner for the Render free-tier cold start. */
export default function ServerStatus() {
  const [state, setState] = useState("checking"); // checking | waking | ok | down
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState((s) => (s === "checking" ? "waking" : s));
    }, WAKE_DELAY_MS);

    apiClient
      .get("/health", { timeout: HEALTH_TIMEOUT_MS, signal: controller.signal, skipProgress: true })
      .then(() => setState("ok"))
      .catch(() => {
        if (!controller.signal.aborted) setState("down");
      });

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);

  const retry = () => {
    setState("checking");
    setAttempt((a) => a + 1);
  };

  if (state === "waking") {
    return (
      <div className="server-banner" role="status">
        <span className="spinner" aria-hidden="true" />
        Waking up the server &mdash; the free tier can take up to a minute.
      </div>
    );
  }
  if (state === "down") {
    return (
      <div className="server-banner server-banner-error" role="alert">
        Can&apos;t reach the server.
        <button type="button" className="banner-btn" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }
  return null;
}