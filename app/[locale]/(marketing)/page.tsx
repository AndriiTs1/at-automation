import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardIcon } from "@/components/dashboard/icons";
import AutomationCapabilities from "@/components/marketing/AutomationCapabilities";
import ContactSection from "@/components/marketing/ContactSection";
import IntegrationEcosystem from "@/components/marketing/IntegrationEcosystem";
import { Link } from "@/i18n/navigation";
import { buildHomepageJsonLd } from "@/lib/structured-data";

export default async function Home(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const tHero = await getTranslations("Hero");
  const tMetadata = await getTranslations("Metadata");
  const jsonLd = buildHomepageJsonLd(locale, tMetadata("description"));

  return (
    <main className="flex-1">
      {/* Organization/ProfessionalService + WebSite structured data — homepage only, rendered
          exactly once here (see lib/structured-data.ts for what's included and why). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative px-6 pt-30 pb-10 text-center md:pt-34 md:pb-12 lg:pt-34 lg:pb-8">
        {/* Highlights, wide screens: two concrete facts on each side of the headline. Below
            1400px there's no room beside the hero, so the same four render as a strip under the
            trust line instead (see HeroHighlights below). */}
        <ul className="absolute top-1/2 left-10 hidden w-52 -translate-y-1/2 flex-col gap-5 min-[1400px]:flex">
          {HIGHLIGHTS.slice(0, 2).map((item) => (
            <HeroHighlight key={item.key} icon={item.icon} label={tHero(`highlights.${item.key}`)} />
          ))}
        </ul>
        <ul className="absolute top-1/2 right-10 hidden w-52 -translate-y-1/2 flex-col gap-5 min-[1400px]:flex">
          {HIGHLIGHTS.slice(2).map((item) => (
            <HeroHighlight key={item.key} icon={item.icon} label={tHero(`highlights.${item.key}`)} />
          ))}
        </ul>

        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent md:mb-4">{tHero("eyebrow")}</p>

          <h1 className="mx-auto max-w-xs text-4xl leading-[1.1] font-bold tracking-tight text-foreground [hyphens:none] md:mx-0 md:max-w-none md:text-7xl md:leading-[0.95] lg:text-8xl">
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

          {/* Separate wrapper for the 1400px hide: on the list itself it would lose to sm:flex. */}
          <div className="min-[1400px]:hidden">
            <ul className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-x-4 gap-y-3 sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8">
              {HIGHLIGHTS.map((item) => (
                <HeroHighlight key={item.key} icon={item.icon} label={tHero(`highlights.${item.key}`)} />
              ))}
            </ul>
          </div>
        </div>
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

/** Hero highlight facts, in display order: the first two sit left of the headline, the last two
 * right of it. Icons come from the dashboard icon set (components/dashboard/icons.tsx). */
const HIGHLIGHTS = [
  { key: "launch", icon: "bolt" },
  { key: "integrations", icon: "plug" },
  { key: "custom", icon: "wrench" },
  { key: "unified", icon: "chart" },
] as const;

function HeroHighlight({ icon, label }: { icon: string; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-left text-sm leading-snug text-neutral-600">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <DashboardIcon name={icon} className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </li>
  );
}
