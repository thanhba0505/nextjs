import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants/cookies";

type CookieOptions = Cookies.CookieAttributes;

function buildCookieOptions(exp?: number): CookieOptions {
  const expires = typeof exp === "number" ? new Date(exp * 1000) : undefined;
  return {
    expires,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

export function setAccessToken(token: string, exp?: number) {
  Cookies.set(COOKIE_KEYS.accessToken, token, buildCookieOptions(exp));
  if (typeof exp === "number") Cookies.set(COOKIE_KEYS.accessExp, String(exp), buildCookieOptions(exp));
}

export function getAccessToken(): string | undefined {
  return Cookies.get(COOKIE_KEYS.accessToken);
}

export function removeAccessToken() {
  Cookies.remove(COOKIE_KEYS.accessToken);
  Cookies.remove(COOKIE_KEYS.accessExp);
}

export function setRefreshToken(token: string, refreshExp?: number) {
  Cookies.set(COOKIE_KEYS.refreshToken, token, buildCookieOptions(refreshExp));
  if (typeof refreshExp === "number")
    Cookies.set(COOKIE_KEYS.refreshExp, String(refreshExp), buildCookieOptions(refreshExp));
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(COOKIE_KEYS.refreshToken);
}

export function removeRefreshToken() {
  Cookies.remove(COOKIE_KEYS.refreshToken);
  Cookies.remove(COOKIE_KEYS.refreshExp);
}

export function clearAuthCookies() {
  removeAccessToken();
  removeRefreshToken();
}
