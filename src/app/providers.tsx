"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { AuthBootstrap } from "@/providers/auth-bootstrap";
import { IntlProvider } from "@/providers/intl-provider";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <IntlProvider>
        <AuthBootstrap>
          <AppShell>{children}</AppShell>
        </AuthBootstrap>
      </IntlProvider>
    </QueryProvider>
  );
}
