"use client";

import axios from "axios";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin + "/api";
  }
  return "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (token ? prom.resolve(token) : prom.reject(error)));
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
  },
});

export const setAuthToken = (token) => {
  if (typeof window !== "undefined" && token) {
    const value = String(token).replace(/^Bearer\s+/i, "").trim();
    localStorage.setItem(TOKEN_KEY, value);
    localStorage.setItem("token", value);
  }
};

const TOKEN_KEYS = [TOKEN_KEY, "token", "access_token", "accessToken"];

function getTokenFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  for (const key of TOKEN_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value && value.trim()) return value.trim();
    } catch (_) {}
  }
  return null;
}

export const getAuthToken = () => {
  return getTokenFromStorage();
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  }
};

export const setRefreshToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

export const removeRefreshToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearAuth = () => {
  removeAuthToken();
  removeRefreshToken();
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const setRedirectPath = (path) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("redirect_after_login", path);
  }
};

export const getRedirectPath = () => {
  if (typeof window !== "undefined") {
    const path = sessionStorage.getItem("redirect_after_login");
    sessionStorage.removeItem("redirect_after_login");
    return path;
  }
  return null;
};

export const setSessionExpiredFlag = () => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("session_expired", "true");
  }
};

export const getAndClearSessionExpiredFlag = () => {
  if (typeof window !== "undefined") {
    const flag = sessionStorage.getItem("session_expired");
    sessionStorage.removeItem("session_expired");
    return flag === "true";
  }
  return false;
};

apiClient.interceptors.request.use(
  (config) => {
    const isLoginRequest = config.url?.includes("/auth/login");
    const isSignupRequest = config.url?.includes("/auth/signup");
    const isRefreshRequest = config.url?.includes("/auth/refresh-token");

    if (!isLoginRequest && !isSignupRequest && !isRefreshRequest) {
      const token = getTokenFromStorage();
      if (token) {
        const bearerToken = token.replace(/^Bearer\s+/i, "").trim();
        if (!config.headers) config.headers = {};
        config.headers["Authorization"] = `Bearer ${bearerToken}`;
      }
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        if (typeof config.headers.delete === "function") {
          config.headers.delete("Content-Type");
        } else {
          delete config.headers["Content-Type"];
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isSignupRequest = originalRequest?.url?.includes("/auth/signup");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

    if (typeof window !== "undefined") {
      try {
        const errorInfo = {
          message: error.message || "API call failed",
          error: {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          },
          endpoint: originalRequest?.url || "Unknown",
          method: originalRequest?.method?.toUpperCase() || "Unknown",
          statusCode: error.response?.status ?? null,
          baseURL: originalRequest?.baseURL,
        };
        fetch("/api/log-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorInfo),
        }).catch(() => {});
      } catch (_) {}
    }

    if (error.response?.status === 401 && !isLoginRequest && !isSignupRequest) {
      if (isRefreshRequest || originalRequest?._retry) {
        clearAuth();
        if (typeof window !== "undefined") {
          setRedirectPath(window.location.pathname);
          setSessionExpiredFlag();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        if (typeof window !== "undefined") {
          setRedirectPath(window.location.pathname);
          setSessionExpiredFlag();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return apiClient
        .post("/auth/refresh-token", { refreshToken })
        .then((res) => {
          const data = res?.data ?? res;
          const newToken =
            data?.data?.accessToken ??
            data?.data?.token ??
            data?.accessToken ??
            data?.token;
          const newRefreshToken =
            data?.data?.refreshToken ?? data?.data?.refresh_token ?? data?.refreshToken ?? data?.refresh_token;
          if (newToken) setAuthToken(newToken);
          if (newRefreshToken) setRefreshToken(newRefreshToken);
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          clearAuth();
          if (typeof window !== "undefined") {
            setRedirectPath(window.location.pathname);
            setSessionExpiredFlag();
            window.location.href = "/login";
          }
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  }
);

const formatErrorMessage = (message) => {
  if (Array.isArray(message)) {
    return message.map((e) => e.message || e).join(", ");
  }
  return message;
};

const getErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const rawMessage = data?.message ?? data?.error ?? data?.data?.message;
    const message = formatErrorMessage(rawMessage);

    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";
      case 401:
        return message || "Session expired. Please login again.";
      case 403:
        return message || "You don't have permission to access this resource.";
      case 404:
        return message || "Resource not found.";
      case 409:
        return message || "Conflict occurred. Please retry.";
      case 422:
        return message || "Validation failed. Please check your input.";
      case 429:
        return message || "Too many requests. Please slow down.";
      case 500:
      case 502:
      case 503:
      case 504:
        return message || "Server error. Please try again later.";
      default:
        return message || `Request failed with status ${status}`;
    }
  }
  if (error.request) {
    return "Network error. Please check your internet connection.";
  }
  return error.message || "An unexpected error occurred.";
};

const createApiError = (error) => {
  const apiError = new Error(getErrorMessage(error));
  apiError.status = error.response?.status;
  apiError.data = error.response?.data;
  apiError.originalError = error;
  return apiError;
};

export const get = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const post = async (endpoint, data = {}, isFormData = false) => {
  try {
    const config = {};
    if (data instanceof FormData) {
      // Remove default application/json so axios sets multipart/form-data with boundary
      config.headers = { "Content-Type": false };
    } else if (isFormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    }
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const put = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const patch = async (endpoint, data = {}, isFormData = false) => {
  try {
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    const response = await apiClient.patch(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const del = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export default apiClient;
