import axios from "axios";
import apiClient from "./config";

const handleAuthError = (error, fallback) => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data?.message || fallback,
    };
  }
  return {
    success: false,
    message: fallback,
  };
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    return handleAuthError(error, "Login failed");
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const response = await apiClient.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    return handleAuthError(error, "Signup failed");
  }
};
