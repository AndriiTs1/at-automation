import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "it", "fr", "ru", "uk"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // URL is the sole source of truth for locale: an unprefixed path (e.g. "/",
  // "/demo") must always resolve to the default locale (English), regardless
  // of a stored NEXT_LOCALE cookie or the browser's Accept-Language header.
  // Explicit locale prefixes (e.g. "/ru", "/ru/demo") are matched directly
  // from the URL and are unaffected by this flag — they always win.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Display label for the language switcher: Ukrainian is shown as "UA" while
// the locale code (and URL prefix) stays the ISO 639-1 "uk".
export function localeLabel(locale: AppLocale): string {
  return locale === "uk" ? "UA" : locale.toUpperCase();
}
