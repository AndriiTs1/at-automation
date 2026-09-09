import { routing } from "@/i18n/routing";

/**
 * Single source of truth for the production base URL. Previously hardcoded inline inside
 * `app/[locale]/layout.tsx`'s generateMetadata; centralized here so robots.ts, sitemap.ts, and
 * structured data can all reuse the same value instead of repeating the literal.
 */
export const SITE_URL = "https://at-automation-ai.vercel.app";

/**
 * Public path for a given locale's homepage, honoring routing's `localePrefix: "as-needed"`:
 * the default locale (en) is unprefixed at "/", every other locale is prefixed with its code.
 * proxy.ts (next-intl's middleware) already redirects a literal `/en` request to `/`, so this is
 * also the only canonical path that should ever be advertised for the default locale.
 */
export function localePath(locale: string): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

/**
 * hreflang alternates for the marketing homepage, keyed by locale code plus `x-default` pointing
 * at the English root — used for both `metadata.alternates.languages` and the sitemap's own
 * per-URL language alternates.
 */
export function homepageLanguageAlternates(): Record<string, string> {
  const entries = routing.locales.map((locale) => [locale, localePath(locale)] as const);
  return Object.fromEntries([...entries, ["x-default", localePath(routing.defaultLocale)]]);
}

/** Open Graph uses underscore region-qualified locale codes rather than bare language codes. */
export const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
  it: "it_IT",
  fr: "fr_FR",
  ru: "ru_RU",
  uk: "uk_UA",
};
