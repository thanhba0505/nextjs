import type { AxiosRequestConfig, Method } from "axios";
import { apiClient } from "@/lib/axios";
import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api";

export interface BaseApiOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  isMultipart?: boolean;
}

export class BaseApi {
  private static async request<T>(
    method: Method,
    url: string,
    data?: unknown,
    options?: BaseApiOptions,
  ): Promise<ApiSuccess<T>> {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params: options?.params,
      headers: options?.headers,
      signal: options?.signal,
      timeout: options?.timeout,
    };

    if (options?.isMultipart) {
      config.headers = { ...(config.headers ?? {}), "Content-Type": "multipart/form-data" };
    }

    const response = await apiClient.request<ApiResponse<T>>(config);
    if (response.data.success) return response.data;

    throw response.data satisfies ApiError;
  }

  static get<T>(url: string, options?: BaseApiOptions) {
    return this.request<T>("GET", url, undefined, options);
  }

  static post<T>(url: string, data?: unknown, options?: BaseApiOptions) {
    return this.request<T>("POST", url, data, options);
  }

  static put<T>(url: string, data?: unknown, options?: BaseApiOptions) {
    return this.request<T>("PUT", url, data, options);
  }

  static patch<T>(url: string, data?: unknown, options?: BaseApiOptions) {
    return this.request<T>("PATCH", url, data, options);
  }

  static delete<T>(url: string, options?: BaseApiOptions) {
    return this.request<T>("DELETE", url, undefined, options);
  }
}
