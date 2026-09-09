import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { homepageLanguageAlternates, localePath, SITE_URL } from "@/lib/site-config";

/**
 * Only the marketing homepage, once per locale — the demo app is intentionally excluded (see
 * app/robots.ts and app/[locale]/demo/layout.tsx). `lastModified` is deliberately omitted: there
 * is no CMS or content-versioning source in this project that could back a meaningful timestamp,
 * and a fake `new Date()` on every build would be worse than no signal at all.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(homepageLanguageAlternates()).map(([locale, path]) => [locale, `${SITE_URL}${path}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    alternates: { languages },
  }));
}
