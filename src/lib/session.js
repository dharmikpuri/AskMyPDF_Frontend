// Namespaced localStorage session helpers. Every key we own starts with "askmypdf.".
const PREFIX = "askmypdf.";
const KEYS = {
  token: `${PREFIX}token`,
  user: `${PREFIX}user`,
  sessions: `${PREFIX}sessions`,
};

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable or full - ignore */
  }
};

const parse = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const getToken = () => read(KEYS.token);
export const getUser = () => parse(read(KEYS.user), null);
export const getSessions = () => {
  const map = parse(read(KEYS.sessions), {});
  return map && typeof map === "object" && !Array.isArray(map) ? map : {};
};

export const setSessions = (map) => write(KEYS.sessions, JSON.stringify(map));

export const updateUser = (patch) => {
  const current = getUser();
  if (!current) return;
  write(KEYS.user, JSON.stringify({ ...current, ...patch }));
};

/** Start a fresh session. Chat-session ids belong to the previous user, so they are dropped. */
export const setAuth = ({ token, user }) => {
  clearSession();
  write(KEYS.token, token);
  write(KEYS.user, JSON.stringify(user));
};

/** Remove every askmypdf.* key. */
export const clearSession = () => {
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) doomed.push(key);
    }
    doomed.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
};

/** One-time migration from the pre-namespaced keys. */
export const migrateLegacySession = () => {
  try {
    const legacy = {
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user"),
      sessions: localStorage.getItem("chatSessionsByDoc"),
    };
    if (legacy.token && !read(KEYS.token)) write(KEYS.token, legacy.token);
    if (legacy.user && !read(KEYS.user)) write(KEYS.user, legacy.user);
    if (legacy.sessions && !read(KEYS.sessions)) write(KEYS.sessions, legacy.sessions);
    ["token", "user", "chatSessionsByDoc"].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
};
