"use client";

import { NextIntlClientProvider } from "next-intl";
import { useMemo } from "react";
import enMessages from "@/locales/en.json";
import viMessages from "@/locales/vi.json";
import type { Locale } from "@/constants/locales";

export function IntlProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
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
