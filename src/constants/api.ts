export const API_BASE_PATH = "/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  me: "/me",
  meDesktopApps: {
    list: "/me/desktop_apps",
    create: "/me/desktop_apps",
    byAppId: (appId: number) => `/me/desktop_apps/${appId}`,
    positions: "/me/desktop_apps/positions",
  },
  meTaskbarApps: {
    list: "/me/taskbar_apps",
    create: "/me/taskbar_apps",
    byAppId: (appId: number) => `/me/taskbar_apps/${appId}`,
    positions: "/me/taskbar_apps/positions",
  },
} as const;
