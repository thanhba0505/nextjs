import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants/cookies";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function resolveLocaleFromUrl(search: string): Locale | undefined {
  const params = new URLSearchParams(search);
  const value = params.get("locale");
  if (typeof value === "string" && isLocale(value)) return value;
  return undefined;
}

export function getClientLocale(): Locale {
  if (typeof window !== "undefined") {
    const fromQuery = resolveLocaleFromUrl(window.location.search);
    if (fromQuery) return fromQuery;
  }

  const fromCookie =
    typeof document !== "undefined"
      ? Cookies.get(COOKIE_KEYS.locale)
      : undefined;
  if (typeof fromCookie === "string" && isLocale(fromCookie)) return fromCookie;

  return DEFAULT_LOCALE;
}

export function setClientLocale(locale: Locale) {
  Cookies.set(COOKIE_KEYS.locale, locale, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
