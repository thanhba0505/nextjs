import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { env } from "@/config/env";
import { emitAuthInvalidated } from "@/lib/auth-events";
import { getClientLocale } from "@/lib/locale";
import type { ApiError, ApiResponse } from "@/types/api";
import type { RefreshResponseData } from "@/types/auth";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/tokens";

type AxiosConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

function isAuthEndpoint(url?: string) {
  if (!url) return false;
  return (
    url.includes(API_ENDPOINTS.auth.login) ||
    url.includes(API_ENDPOINTS.auth.refresh) ||
    url.includes(API_ENDPOINTS.auth.logout)
  );
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data && typeof data === "object" && "success" in data) return data;
    return {
      success: false,
      message: error.message,
      data: null,
      errors: ["AxiosError"],
    };
  }

  if (error instanceof Error) {
    return { success: false, message: error.message, data: null, errors: ["Error"] };
  }

  return { success: false, message: "Unknown error", data: null, errors: ["Unknown"] };
}

let refreshPromise: Promise<RefreshResponseData> | null = null;

async function refreshTokens(): Promise<RefreshResponseData> {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token");

  refreshPromise = apiClient
    .post<ApiResponse<RefreshResponseData>>(
      API_ENDPOINTS.auth.refresh,
      { refresh_token: refreshToken },
      { _skipAuthRefresh: true } as AxiosConfig,
    )
    .then((res) => {
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export const apiClient = axios.create({
  baseURL: `${env.apiUrl}${env.apiBasePath}`,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const locale = getClientLocale();

  config.headers.set("Accept-Language", locale);
  config.headers.set("Accept", "application/json");
  config.headers.set("Content-Type", "application/json");

  const token = getAccessToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const responseStatus = error.response?.status;
    const config = error.config as AxiosConfig | undefined;

    if (responseStatus !== 401 || !config) return Promise.reject(error);

    if (config._skipAuthRefresh || config._retry || isAuthEndpoint(config.url)) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const refreshed = await refreshTokens();
      setAccessToken(refreshed.token, refreshed.exp);
      setRefreshToken(refreshed.refresh_token, refreshed.refresh_exp);

      config.headers = config.headers ?? new axios.AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${refreshed.token}`);

      return apiClient(config);
    } catch (refreshError) {
      clearAuthCookies();
      emitAuthInvalidated();
      return Promise.reject(toApiError(refreshError));
    }
  },
);
