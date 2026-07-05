"use client";

import { Check, Clock3, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TaskbarAppList } from "@/components/taskbar/taskbar-app-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/constants/locales";
import {
  FOOTER_HEIGHT_PX,
  FOOTER_LAYOUT_PADDING_X_PX,
} from "@/constants/layout";
import { setClientLocale } from "@/lib/locale";
import { useAuthStore } from "@/store/auth.store";
import { useLocaleStore } from "@/store/locale.store";
import { useModalStore } from "@/store/modal.store";

export function Footer() {
  const tAuth = useTranslations("auth");
  const tWorkspace = useTranslations("workspace");

  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const openModal = useModalStore((s) => s.openModal);
  const loading = useAuthStore((s) => s.loading);

  const currentLocale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(currentLocale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [currentLocale],
  );

  const onChangeLocale = (locale: Locale) => {
    setClientLocale(locale);
    setLocale(locale);
    router.refresh();
  };

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div
        className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 text-xs text-muted-foreground"
        style={{
          height: `${FOOTER_HEIGHT_PX}px`,
          padding: `0 ${FOOTER_LAYOUT_PADDING_X_PX}px`,
        }}
      >
        <div className="flex items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label={tAuth("menu.triggerLabel")}
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" className="w-72">
              <DropdownMenuLabel className="px-2 py-2 text-sm font-normal text-foreground">
                {isAuthenticated ? (
                  <>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">
                      {tAuth("menu.signedOutTitle")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tAuth("menu.signedOutDescription")}
                    </div>
                  </>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {!isAuthenticated ? (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal("login");
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  {tAuth("menu.signIn")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={loading}
                  onSelect={async () => {
                    try {
                      await logout();
                      toast.success(tAuth("toast.logoutSuccess"));
                    } catch {
                      toast.error(tAuth("toast.logoutFailed"));
                    }
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {tAuth("menu.signOut")}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {tAuth("menu.languageLabel")}
              </DropdownMenuLabel>

              <DropdownMenuItem
                onSelect={() => onChangeLocale("vi")}
                className="justify-between"
              >
                {tAuth("menu.localeVi")}
                {currentLocale === "vi" ? <Check className="h-4 w-4" /> : null}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => onChangeLocale("en")}
                className="justify-between"
              >
                {tAuth("menu.localeEn")}
                {currentLocale === "en" ? <Check className="h-4 w-4" /> : null}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-center">
          <TaskbarAppList />
        </div>

        <div
          className="flex items-center justify-end gap-2"
          aria-label={tWorkspace("taskbar.clockLabel")}
        >
          <Clock3 className="h-4 w-4" />
          <span className="min-w-12 text-right font-medium text-foreground">
            {timeFormatter.format(now)}
          </span>
        </div>
      </div>
    </footer>
  );
}
