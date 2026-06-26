import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_KEYS } from "@/constants/cookies";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const token = request.cookies.get(COOKIE_KEYS.accessToken)?.value;

  const localeParam = url.searchParams.get("locale");
  const locale =
    localeParam && isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  if (pathname.startsWith(ROUTES.dashboard) && !token) {
    const redirectUrl = new URL(ROUTES.home, request.url);
    if (localeParam) redirectUrl.searchParams.set("locale", localeParam);
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set(COOKIE_KEYS.locale, locale, { sameSite: "lax" });
    return res;
  }

  if (localeParam && isLocale(localeParam)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_KEYS.locale, localeParam, { sameSite: "lax" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
