import type { AppItem } from "@/types/app";

export interface TaskbarAppItem {
  id: number;
  app: AppItem;
  position: number;
}

export interface ListTaskbarAppsResponseData {
  taskbar_apps: TaskbarAppItem[];
}

export interface PinTaskbarAppRequest {
  taskbar_app: {
    app_id: number;
    position: number;
  };
}

export interface PinTaskbarAppResponseData {
  taskbar_app: TaskbarAppItem;
}

export interface UpdateTaskbarAppPositionRequest {
  taskbar_app: {
    position: number;
  };
}

export interface UpdateTaskbarAppPositionResponseData {
  taskbar_app: TaskbarAppItem;
}

export interface UpdateTaskbarAppsPositionsRequest {
  taskbar_apps: Array<{
    app_id: number;
    position: number;
  }>;
}

export interface UpdateTaskbarAppsPositionsResponseData {
  taskbar_apps: TaskbarAppItem[];
}
