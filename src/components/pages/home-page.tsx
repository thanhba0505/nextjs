"use client";

import { useTranslations } from "next-intl";

export function HomePage() {
  const t = useTranslations("pages");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("home.title")}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t("home.description")}</p>
    </div>
  );
}
