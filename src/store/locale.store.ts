import { create } from "zustand";
import type { Locale } from "@/constants/locales";
import { DEFAULT_LOCALE } from "@/constants/locales";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => set({ locale }),
}));
