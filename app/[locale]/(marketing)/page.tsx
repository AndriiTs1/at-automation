import { getTranslations, setRequestLocale } from "next-intl/server";
import DemoDashboard from "@/components/dashboard/DemoDashboard";
import TabletFrame from "@/components/dashboard/TabletFrame";
import AutomationCapabilities from "@/components/marketing/AutomationCapabilities";
import ContactSection from "@/components/marketing/ContactSection";
import IntegrationEcosystem from "@/components/marketing/IntegrationEcosystem";
import { Link } from "@/i18n/navigation";
import { buildHomepageJsonLd } from "@/lib/structured-data";

export default async function Home(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const tHero = await getTranslations("Hero");
  const tPreview = await getTranslations("Preview");
  const tMetadata = await getTranslations("Metadata");
  const jsonLd = buildHomepageJsonLd(locale, tMetadata("description"));

  return (
    <main className="flex-1">
      {/* Organization/ProfessionalService + WebSite structured data — homepage only, rendered
          exactly once here (see lib/structured-data.ts for what's included and why). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative px-6 pt-30 pb-5 text-center md:pt-34 md:pb-1 lg:pt-34 lg:pb-2">
        {/* One shared 1040px column for the headline, copy, CTAs and the highlights strip; the
            copy itself stays narrower (max-w-2xl) so lines don't stretch to fill it. */}
        <div className="mx-auto max-w-[1040px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent md:mb-4">{tHero("eyebrow")}</p>

          {/* Fluid size instead of breakpoint jumps: up to lg it scales with the phone/tablet
              viewport (36px at 390px → 68px at ~760px); from lg the wide-screen range takes over
              (80px up to ~1430px, then growing to 104px at ~1860px). */}
          <h1 className="mx-auto max-w-xs text-[length:clamp(36px,9vw,68px)] leading-[1.1] font-bold tracking-tight text-foreground [hyphens:none] md:mx-0 md:max-w-none md:leading-[0.95] lg:text-[length:clamp(80px,5.6vw,104px)] lg:leading-[0.98] lg:tracking-[-0.04em]">
            <span className="block">{tHero("headlineLine1")}</span>
            <span className="block">{tHero("headlineLine2")}</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 md:mt-6 md:text-xl">{tHero("subhead")}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {tHero("ctaPrimary")}
            </a>
            <Link
              href="/demo"
              className="rounded-full border border-black/15 px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              {tHero("ctaSecondary")}
            </Link>
          </div>

          <p className="mt-4 text-sm text-neutral-500">{tHero("trustLine")}</p>

          {/* Highlights strip — four plain-text facts between the CTAs and the dashboard preview,
              the full width of the hero column. A stacked list on phones, 2×2 from sm, one row of
              four from lg; the dividers are per-cell borders (see HIGHLIGHT_DIVIDERS) since
              divide-x/divide-y can't follow those layout switches. */}
          <ul className="mx-auto mt-9 grid max-w-xs grid-cols-1 sm:mt-8 sm:max-w-none sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {HIGHLIGHT_KEYS.map((key, index) => (
              <li key={key} className={`flex flex-col items-center px-3 py-3 sm:py-4 lg:px-4 lg:py-0 ${HIGHLIGHT_DIVIDERS[index]}`}>
                <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground xl:text-lg">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {tHero(`highlights.${key}.value`)}
                </span>
                <span className="mt-1 text-[13px] text-neutral-600 lg:text-sm">{tHero(`highlights.${key}.label`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Product showcase — the DemoDashboard is reused here as a picture of the product, so its
          own UI stays out of the accessibility tree and tab order (aria-hidden + inert). The whole
          screen is instead one link to the real /demo, laid over the preview inside the frame. */}
      <section className="relative px-6 pt-6 pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-12 lg:pt-12 lg:pb-24">
        <TabletFrame
          overlay={
            <Link
              href="/demo"
              className="group absolute inset-0 z-10 flex items-center justify-center bg-foreground/0 transition-colors hover:bg-foreground/10 focus-visible:bg-foreground/10 focus-visible:outline-none motion-reduce:transition-none"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 motion-reduce:transition-none">
                {tPreview("openDemo")}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          }
        >
          <div aria-hidden="true" inert className="h-full w-full">
            <DemoDashboard />
          </div>
        </TabletFrame>
      </section>

      {/* What AT can automate */}
      <AutomationCapabilities />

      {/* Systems AT can connect with */}
      <IntegrationEcosystem />

      {/* Consultation request — the page's conversion endpoint */}
      <ContactSection />
    </main>
  );
}

/** Hero highlights strip, in display order — each resolves to Hero.highlights.{key}.{value,label}. */
const HIGHLIGHT_KEYS = ["launch", "custom", "integrations", "unified"] as const;

/** Divider borders per cell, for all three layouts: stacked (a rule above every cell but the
 * first), 2×2 from sm (a rule between the columns and above the second row), and one row of
 * four from lg (a rule left of every cell but the first). */
const HIGHLIGHT_DIVIDERS = [
  "border-border",
  "border-t border-border sm:border-t-0 sm:border-l",
  "border-t border-border lg:border-t-0 lg:border-l",
  "border-t border-border sm:border-l lg:border-t-0",
];
