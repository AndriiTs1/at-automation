import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * The public site is fully crawlable — no Disallow rules. The demo application is a live, usable
 * product demo, not content meant to compete in search results, but it is kept OUT of robots.txt
 * on purpose: a crawler blocked here could never reach the page to see its own `robots: noindex`
 * directive (see app/[locale]/demo/layout.tsx), which is the actual, reliable mechanism keeping it
 * out of search results. Combining a robots.txt Disallow with an HTML noindex on the same page
 * risks the crawler never discovering the noindex at all — so indexing control lives solely in
 * the page's own metadata, not here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
