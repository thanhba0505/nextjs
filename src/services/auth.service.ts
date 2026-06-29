import { API_ENDPOINTS } from "@/constants/api";
import { BaseApi } from "@/lib/base-api";
import type {
  LoginRequest,
  LoginResponseData,
  LogoutRequest,
  LogoutResponseData,
  RefreshRequest,
  RefreshResponseData,
} from "@/types/auth";
import type { ApiSuccess } from "@/types/api";
import type { CurrentUser } from "@/types/user";

export type MeResponseData = {
  user: CurrentUser;
};

export class AuthService {
  static login(payload: LoginRequest): Promise<ApiSuccess<LoginResponseData>> {
    return BaseApi.post<LoginResponseData>(API_ENDPOINTS.auth.login, payload);
  }

  static refresh(
    payload: RefreshRequest,
  ): Promise<ApiSuccess<RefreshResponseData>> {
    return BaseApi.post<RefreshResponseData>(
      API_ENDPOINTS.auth.refresh,
      payload,
      {
        timeout: 20_000,
      },
    );
  }

  static logout(
    payload: LogoutRequest,
  ): Promise<ApiSuccess<LogoutResponseData>> {
    return BaseApi.post<LogoutResponseData>(API_ENDPOINTS.auth.logout, payload);
  }

  static me(): Promise<ApiSuccess<MeResponseData>> {
    return BaseApi.get<MeResponseData>(API_ENDPOINTS.me);
  }
}
