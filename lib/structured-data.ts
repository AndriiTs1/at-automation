import { SITE_URL } from "@/lib/site-config";

/**
 * JSON-LD for the marketing homepage only — rendered once, in `app/[locale]/(marketing)/page.tsx`,
 * never duplicated across other components. One Organization node doubles as ProfessionalService
 * (schema.org allows multiple `@type` values on one node) rather than declaring a second,
 * near-identical entity, per the "avoid duplicating equivalent Organization JSON-LD" requirement.
 *
 * Every fact below is already publicly stated elsewhere on the site (Footer.tsx: name, founder,
 * Lugano/Switzerland, LinkedIn; Header.tsx: contact email; Metadata.description translation:
 * business description) — nothing here is invented. Deliberately omitted: streetAddress,
 * telephone, VAT/registration numbers, ratings, opening hours, price range, employee count, and
 * founding date, since none of these are stated anywhere on the site.
 */
export function buildHomepageJsonLd(locale: string, description: string) {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": organizationId,
        name: "AT Automation",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/logo.png`,
        description,
        email: "info@andrii-tsiurupa.ch",
        founder: {
          "@type": "Person",
          name: "Tsiurupa Andrii",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lugano",
          addressCountry: "CH",
        },
        sameAs: ["https://www.linkedin.com/in/andrii-tsiurupa-ch/"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "AT Automation",
        url: SITE_URL,
        inLanguage: locale,
        publisher: { "@id": organizationId },
      },
    ],
  };
}
