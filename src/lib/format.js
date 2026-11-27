export const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

let counter = 0;
export const uid = () => {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`;
};

const NOT_FOUND_ANSWER = "I couldn't find that in this document.";
export const isNotFoundAnswer = (text) =>
  typeof text === "string" &&
  text.trim().replace(/\u2019/g, "'") === NOT_FOUND_ANSWER;
