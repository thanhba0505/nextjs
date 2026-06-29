import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AppProviders } from "./providers";
import { COOKIE_KEYS } from "@/constants/cookies";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Frontend",
  description: "Frontend foundation",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIE_KEYS.locale)?.value;
  const locale: Locale =
    typeof fromCookie === "string" &&
    (LOCALES as readonly string[]).includes(fromCookie)
      ? (fromCookie as Locale)
      : DEFAULT_LOCALE;

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders initialLocale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
