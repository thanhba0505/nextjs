import type { User } from "@/types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  refresh_token: string;
  exp: number;
  refresh_exp: number;
  user: User;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponseData {
  token: string;
  refresh_token: string;
  exp: number;
  refresh_exp: number;
}

export interface LogoutRequest {
  refresh_token: string;
}

export type LogoutResponseData = Record<string, never>;
