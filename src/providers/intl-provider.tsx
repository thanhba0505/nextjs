"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import enMessages from "@/locales/en.json";
import viMessages from "@/locales/vi.json";
import { getClientLocale } from "@/lib/locale";
import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const nextLocale = getClientLocale();
    const id = window.setTimeout(() => setLocale(nextLocale), 0);
    return () => window.clearTimeout(id);
  }, []);

  const messages: Record<string, unknown> = useMemo(
    () => (locale === "en" ? enMessages : viMessages),
    [locale],
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
