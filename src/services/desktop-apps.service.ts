import { API_ENDPOINTS } from "@/constants/api";
import { BaseApi } from "@/lib/base-api";
import type { ApiSuccess } from "@/types/api";
import type {
  ListDesktopAppsResponseData,
  PinDesktopAppRequest,
  PinDesktopAppResponseData,
  UpdateDesktopAppPositionRequest,
  UpdateDesktopAppPositionResponseData,
  UpdateDesktopAppsPositionsRequest,
  UpdateDesktopAppsPositionsResponseData,
} from "@/types/desktop-app";

export class DesktopAppsService {
  static list(): Promise<ApiSuccess<ListDesktopAppsResponseData>> {
    return BaseApi.get<ListDesktopAppsResponseData>(
      API_ENDPOINTS.meDesktopApps.list,
    );
  }

  static pin(
    payload: PinDesktopAppRequest,
  ): Promise<ApiSuccess<PinDesktopAppResponseData>> {
    return BaseApi.post<PinDesktopAppResponseData>(
      API_ENDPOINTS.meDesktopApps.create,
      payload,
    );
  }

  static updatePosition(
    appId: number,
    payload: UpdateDesktopAppPositionRequest,
  ): Promise<ApiSuccess<UpdateDesktopAppPositionResponseData>> {
    return BaseApi.patch<UpdateDesktopAppPositionResponseData>(
      API_ENDPOINTS.meDesktopApps.byAppId(appId),
      payload,
    );
  }

  static updatePositionPut(
    appId: number,
    payload: UpdateDesktopAppPositionRequest,
  ): Promise<ApiSuccess<UpdateDesktopAppPositionResponseData>> {
    return BaseApi.put<UpdateDesktopAppPositionResponseData>(
      API_ENDPOINTS.meDesktopApps.byAppId(appId),
      payload,
    );
  }

  static unpin(appId: number): Promise<ApiSuccess<Record<string, never>>> {
    return BaseApi.delete<Record<string, never>>(
      API_ENDPOINTS.meDesktopApps.byAppId(appId),
    );
  }

  static updatePositions(
    payload: UpdateDesktopAppsPositionsRequest,
  ): Promise<ApiSuccess<UpdateDesktopAppsPositionsResponseData>> {
    return BaseApi.patch<UpdateDesktopAppsPositionsResponseData>(
      API_ENDPOINTS.meDesktopApps.positions,
      payload,
    );
  }

  static updatePositionsPut(
    payload: UpdateDesktopAppsPositionsRequest,
  ): Promise<ApiSuccess<UpdateDesktopAppsPositionsResponseData>> {
    return BaseApi.put<UpdateDesktopAppsPositionsResponseData>(
      API_ENDPOINTS.meDesktopApps.positions,
      payload,
    );
  }
}
