export const API_BASE_PATH = "/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  me: "/me",
} as const;
