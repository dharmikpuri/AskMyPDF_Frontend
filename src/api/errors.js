import axios from "axios";

const NETWORK_MESSAGE =
  "Can't reach the server. Check your connection and try again.";

/** Normalise any axios error into { message, code, status }. */
export function parseApiError(err, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(err) && err.response) {
    const data = err.response.data;
    return {
      message: typeof data?.message === "string" && data.message ? data.message : fallback,
      code: data?.code || null,
      status: err.response.status,
    };
  }
  return { message: NETWORK_MESSAGE, code: "NETWORK", status: 0 };
}
