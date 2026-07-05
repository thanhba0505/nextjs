export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";
export const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";
