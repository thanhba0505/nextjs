import { API_ENDPOINTS } from "@/constants/api";
import { BaseApi } from "@/lib/base-api";
import type { ApiSuccess } from "@/types/api";
import type {
  ListTaskbarAppsResponseData,
  PinTaskbarAppRequest,
  PinTaskbarAppResponseData,
  UpdateTaskbarAppPositionRequest,
  UpdateTaskbarAppPositionResponseData,
  UpdateTaskbarAppsPositionsRequest,
  UpdateTaskbarAppsPositionsResponseData,
} from "@/types/taskbar-app";

export class TaskbarAppsService {
  static list(): Promise<ApiSuccess<ListTaskbarAppsResponseData>> {
    return BaseApi.get<ListTaskbarAppsResponseData>(
      API_ENDPOINTS.meTaskbarApps.list,
    );
  }

  static pin(
    payload: PinTaskbarAppRequest,
  ): Promise<ApiSuccess<PinTaskbarAppResponseData>> {
    return BaseApi.post<PinTaskbarAppResponseData>(
      API_ENDPOINTS.meTaskbarApps.create,
      payload,
    );
  }

  static updatePosition(
    appId: number,
    payload: UpdateTaskbarAppPositionRequest,
  ): Promise<ApiSuccess<UpdateTaskbarAppPositionResponseData>> {
    return BaseApi.patch<UpdateTaskbarAppPositionResponseData>(
      API_ENDPOINTS.meTaskbarApps.byAppId(appId),
      payload,
    );
  }

  static updatePositionPut(
    appId: number,
    payload: UpdateTaskbarAppPositionRequest,
  ): Promise<ApiSuccess<UpdateTaskbarAppPositionResponseData>> {
    return BaseApi.put<UpdateTaskbarAppPositionResponseData>(
      API_ENDPOINTS.meTaskbarApps.byAppId(appId),
      payload,
    );
  }

  static unpin(appId: number): Promise<ApiSuccess<Record<string, never>>> {
    return BaseApi.delete<Record<string, never>>(
      API_ENDPOINTS.meTaskbarApps.byAppId(appId),
    );
  }

  static updatePositions(
    payload: UpdateTaskbarAppsPositionsRequest,
  ): Promise<ApiSuccess<UpdateTaskbarAppsPositionsResponseData>> {
    return BaseApi.patch<UpdateTaskbarAppsPositionsResponseData>(
      API_ENDPOINTS.meTaskbarApps.positions,
      payload,
    );
  }

  static updatePositionsPut(
    payload: UpdateTaskbarAppsPositionsRequest,
  ): Promise<ApiSuccess<UpdateTaskbarAppsPositionsResponseData>> {
    return BaseApi.put<UpdateTaskbarAppsPositionsResponseData>(
      API_ENDPOINTS.meTaskbarApps.positions,
      payload,
    );
  }
}
