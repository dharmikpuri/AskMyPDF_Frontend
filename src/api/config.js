import axios from "axios";
import { toast } from "react-toastify";
import { clearSession, getToken, getUser } from "../lib/session";
import { parseApiError } from "./errors";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// In-flight request counter (drives the global top progress bar).
let inflight = 0;
const listeners = new Set();
const bump = (delta) => {
  inflight = Math.max(0, inflight + delta);
  listeners.forEach((fn) => fn());
};
export const subscribeInflight = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getInflight = () => inflight;

let unauthorizedHandler = null;
/** Lets the router-aware App register how to navigate to /login. */
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

apiClient.interceptors.request.use((config) => {
  if (!config.skipProgress) bump(1);
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (!response.config?.skipProgress) bump(-1);
    return response;
  },
  (error) => {
    if (!error?.config?.skipProgress) bump(-1);
    const { status, code } = parseApiError(error);
    const sentAuth = error?.config?.headers?.Authorization;
    const token = getToken();
    // Only react if the failing request used the *current* token. After the first
    // failure clears the session, sibling failures (and stale ones) are ignored,
    // so the toast + redirect fire exactly once.
    if (status === 401 && code === "UNAUTHORIZED" && token && sentAuth === `Bearer ${token}`) {
      const wasGuest = !!getUser()?.isGuest;
      clearSession();
      toast.info(
        wasGuest
          ? "Your demo session ended."
          : "Your session expired \u2014 please log in again.",
        { toastId: "session-expired" }
      );
      if (unauthorizedHandler) unauthorizedHandler();
      else window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;