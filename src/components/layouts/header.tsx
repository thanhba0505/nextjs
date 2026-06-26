"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { LOCALES } from "@/constants/locales";
import { cn } from "@/lib/cn";
import { getClientLocale, setClientLocale } from "@/lib/locale";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";

function setLocaleInUrl(pathname: string, searchParams: URLSearchParams, locale: Locale) {
  const next = new URLSearchParams(searchParams);
  next.set("locale", locale);
  return `${pathname}?${next.toString()}`;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const openModal = useModalStore((s) => s.openModal);
  const locale = getClientLocale();

  const onChangeLocale = (value: Locale) => {
    setClientLocale(value);
    const url = setLocaleInUrl(pathname, new URLSearchParams(searchParams.toString()), value);
    router.replace(url);
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link className="text-sm font-semibold tracking-tight" href="/">
          Next Frontend
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                className={cn(
                  "px-2 py-1 text-xs font-medium",
                  l === locale
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                )}
                onClick={() => onChangeLocale(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {!isAuthenticated ? (
            <Button variant="secondary" onClick={() => openModal("login")}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                void logout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
