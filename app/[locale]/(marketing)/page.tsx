import { getTranslations, setRequestLocale } from "next-intl/server";
import DemoDashboard from "@/components/dashboard/DemoDashboard";
import TabletFrame from "@/components/dashboard/TabletFrame";
import AutomationCapabilities from "@/components/marketing/AutomationCapabilities";
import IntegrationEcosystem from "@/components/marketing/IntegrationEcosystem";
import { Link } from "@/i18n/navigation";

export default async function Home(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const tHero = await getTranslations("Hero");
  const tBridge = await getTranslations("Bridge");

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative px-6 pt-30 pb-10 text-center md:pt-34 md:pb-12 lg:pt-34 lg:pb-8">
        {/* Decorative side labels */}
        <div className="absolute top-1/2 hidden -translate-y-1/2 text-xs font-medium tracking-wider text-neutral-400 uppercase min-[1400px]:block min-[1400px]:left-10">
          <span className="block">{tHero("sideLabelLeft1")}</span>
          <span className="block">{tHero("sideLabelLeft2")}</span>
          <span className="block">{tHero("sideLabelLeft3")}</span>
        </div>
        <div className="absolute top-1/2 hidden -translate-y-1/2 text-xs font-medium tracking-wider text-neutral-400 uppercase min-[1400px]:block min-[1400px]:right-10">
          <span className="block">{tHero("sideLabelRight1")}</span>
          <span className="block">{tHero("sideLabelRight2")}</span>
          <span className="block">{tHero("sideLabelRight3")}</span>
        </div>

        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent md:mb-4">{tHero("eyebrow")}</p>

          <h1 className="mx-auto max-w-xs text-4xl leading-[1.1] font-bold tracking-tight text-foreground [hyphens:none] md:mx-0 md:max-w-none md:text-7xl md:leading-[0.95] lg:text-8xl">
            <span className="block">{tHero("headlineLine1")}</span>
            <span className="block">{tHero("headlineLine2")}</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 md:mt-6 md:text-xl">{tHero("subhead")}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {tHero("ctaPrimary")}
            </Link>
            <a
              href="#capabilities"
              className="rounded-full border border-black/15 px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              {tHero("ctaSecondary")}
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-500">{tHero("trustLine")}</p>
        </div>
      </section>

      {/* Hero → Demo bridge */}
      <section className="px-6 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{tBridge("title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-neutral-600">{tBridge("subtitle")}</p>
          <ChevronDownIcon className="mx-auto mt-4 h-5 w-5 text-neutral-400" />
        </div>
      </section>

      {/* Product showcase */}
      <section className="relative px-6 pt-6 pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-12 lg:pt-12 lg:pb-24">
        <TabletFrame>
          <DemoDashboard />
        </TabletFrame>
      </section>

      {/* What AT can automate */}
      <AutomationCapabilities />

      {/* Systems AT can connect with */}
      <IntegrationEcosystem />
    </main>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}
