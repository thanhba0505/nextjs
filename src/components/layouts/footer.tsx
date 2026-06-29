"use client";

import { Check, LogIn, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { FOOTER_HEIGHT_PX } from "@/constants/layout";
import { setClientLocale } from "@/lib/locale";
import { useAuthStore } from "@/store/auth.store";
import { useLocaleStore } from "@/store/locale.store";
import { useModalStore } from "@/store/modal.store";

export function Footer() {
  const tCommon = useTranslations("common");
  const tLayout = useTranslations("layout");
  const tAuth = useTranslations("auth");

  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const openModal = useModalStore((s) => s.openModal);
  const loading = useAuthStore((s) => s.loading);

  const currentLocale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const onChangeLocale = (locale: Locale) => {
    setClientLocale(locale);
    setLocale(locale);
    router.refresh();
  };

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div
        className="flex w-full items-center justify-between gap-4 px-6 text-xs text-muted-foreground"
        style={{ height: `${FOOTER_HEIGHT_PX}px` }}
      >
        <div className="flex items-center gap-3">
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

          <span>
            {tLayout("footer.copyright", {
              year: new Date().getFullYear(),
              appName: tCommon("title"),
            })}
          </span>
        </div>

        <span>{tLayout("footer.placeholder")}</span>
      </div>
    </footer>
  );
}
