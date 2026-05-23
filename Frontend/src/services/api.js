import axios from "axios";

import { getStoredToken } from "@/utils/authStorage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export default api;
