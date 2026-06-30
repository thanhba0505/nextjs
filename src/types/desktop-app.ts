import type { AppItem } from "@/types/app";

export interface DesktopAppItem {
  id: number;
  app: AppItem;
  grid_x: number;
  grid_y: number;
}

export interface ListDesktopAppsResponseData {
  desktop_apps: DesktopAppItem[];
}

export interface PinDesktopAppRequest {
  desktop_app: {
    app_id: number;
    grid_x: number;
    grid_y: number;
  };
}

export interface PinDesktopAppResponseData {
  desktop_app: DesktopAppItem;
}

export interface UpdateDesktopAppPositionRequest {
  desktop_app: {
    grid_x: number;
    grid_y: number;
  };
}

export interface UpdateDesktopAppPositionResponseData {
  desktop_app: DesktopAppItem;
}

export interface UpdateDesktopAppsPositionsRequest {
  desktop_apps: Array<{
    app_id: number;
    grid_x: number;
    grid_y: number;
  }>;
}

export interface UpdateDesktopAppsPositionsResponseData {
  desktop_apps: DesktopAppItem[];
}
