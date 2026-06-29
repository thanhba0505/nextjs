"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Header() {
  const tCommon = useTranslations("common");

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 w-full items-center justify-between px-6">
        <Link className="text-sm font-semibold tracking-tight" href="/">
          {tCommon("title")}
        </Link>
      </div>
    </header>
  );
}
