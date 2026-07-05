"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layouts/app-shell";
import type { Locale } from "@/constants/locales";
import { AuthBootstrap } from "@/providers/auth-bootstrap";
import { IntlProvider } from "@/providers/intl-provider";
import { QueryProvider } from "@/providers/query-provider";
import { WorkspaceAppsBootstrap } from "@/providers/workspace-apps-bootstrap";
import { useLocaleStore } from "@/store/locale.store";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale, setLocale]);

  return (
    <QueryProvider>
      <IntlProvider locale={initialLocale}>
        <AuthBootstrap>
          <WorkspaceAppsBootstrap>
            <AppShell>{children}</AppShell>
          </WorkspaceAppsBootstrap>
        </AuthBootstrap>
      </IntlProvider>
    </QueryProvider>
  );
}
