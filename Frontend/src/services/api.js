import axios from "axios";

import { getStoredToken } from "@/utils/authStorage.js";

const isProduction = import.meta.env.MODE === 'production';
const api = axios.create({
  baseURL: isProduction ? "/api" : (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api"),
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error) =>
  {
    console.error("API request failed", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestBody: error.config?.data,
    });

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.request && !error.response) {
      return "The API did not return a response. Check the backend URL and CORS settings.";
    }

    return error.message || "Something went wrong. Please try again.";
  };

export default api;
