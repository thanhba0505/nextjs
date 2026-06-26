"use client";

import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/locales/en.json";
import viMessages from "@/locales/vi.json";
import { getClientLocale } from "@/lib/locale";

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = getClientLocale();
  const messages: Record<string, unknown> = locale === "en" ? enMessages : viMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
