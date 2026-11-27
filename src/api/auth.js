import apiClient from "./config";
import { parseApiError } from "./errors";

const fail = (error, fallback) => {
  const { message, code } = parseApiError(error, fallback);
  return { success: false, message, code };
};

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    return fail(error, "Login failed. Please try again.");
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const { data } = await apiClient.post("/auth/signup", { name, email, password });
    return data;
  } catch (error) {
    return fail(error, "Signup failed. Please try again.");
  }
};

export const startDemo = async () => {
  try {
    const { data } = await apiClient.post("/auth/demo");
    return data;
  } catch (error) {
    return fail(error, "The demo is unavailable right now. Please try again shortly.");
  }
};
