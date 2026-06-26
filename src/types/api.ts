export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  errors: null;
}

export interface ApiError {
  success: false;
  message: string;
  data: null;
  errors: string[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
