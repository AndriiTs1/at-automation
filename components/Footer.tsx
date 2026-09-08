"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type LanguageCode = (typeof routing.locales)[number];

/**
 * Marketing Footer — a wide graphite closing surface (approved design direction: see the
 * Stage 3A → 3A-final review). Two structural ideas distinguish this from a generic dark
 * footer:
 *
 * 1. SURFACE width is decoupled from Header's width. Header stays a compact `max-w-[1320px]`
 *    floating pill; Footer's graphite surface is nearly viewport-wide (outer margin only:
 *    12px mobile → 16px tablet → 24px at 1280 → 28px at 1440+), because a tall opaque surface
 *    at Header's narrower width reads as "a large card," not "a closing surface." CONTENT
 *    inside stays constrained to `max-w-6xl` — the same width AutomationCapabilities and
 *    IntegrationEcosystem already use — so typography never stretches to the wide surface.
 *
 * 2. The lower area is ONE navigation band (brand left, product nav + language codes sharing
 *    a right-aligned cluster/baseline) rather than brand/nav/languages/legal as separate
 *    islands. Only the copyright/Privacy/Legal line is demoted to its own quieter row below,
 *    separated by spacing only (no second divider).
 *
 * Brand mark reuses the exact dark-surface "AT" badge + wordmark already established in
 * DashboardSidebar/TabletNavigation (not a new logo): the raw `/logo.png` mark is dark ink on
 * a transparent background, so it has too little contrast against a dark surface.
 *
 * Nav destinations are all real: Capabilities → #capabilities, Integrations → #integrations
 * (a semantic id on IntegrationEcosystem's existing section), Demo → /demo. "Platform" stays
 * omitted: nothing on the current Landing truthfully represents it.
 *
 * The primary CTA ("Discuss your project →") reuses Header's own current `href="#contact"`
 * behavior verbatim — Header has no working contact destination yet either (no `id="contact"`
 * exists anywhere on the site), so this is a known, pre-existing, shared conversion dependency,
 * not something new introduced here.
 *
 * Primary CTA stays a WHITE pill, not AT blue: the design review measured AT blue's contrast
 * against this graphite (~2.1:1 surface-to-surface) versus against Header's white background
 * (~7:1) and rejected the blue-on-graphite option as a real loss of "obvious primary action"
 * authority, not a style preference. White-on-graphite is a deliberate inversion of Header's
 * blue-on-white, not an inconsistency.
 *
 * Privacy/Legal have no implemented destination pages yet, so they render as plain,
 * non-interactive muted labels (no href, no hover state, no pointer cursor) rather than
 * placeholder `href="#"` links.
 */
export default function Footer() {
  const t = useTranslations("Footer");
  const tHero = useTranslations("Hero");
  const tHeader = useTranslations("Header");
  const currentLang = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();

  const selectLanguage = (lang: LanguageCode) => {
    router.replace(pathname, { locale: lang });
  };

  return (
    <footer className="-mt-4 px-3 pb-6 md:-mt-6 md:px-4 md:pb-8 xl:px-6 min-[1440px]:px-7">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-dark shadow-md shadow-black/10 xl:rounded-3xl">
        <div className="mx-auto max-w-6xl">
          {/* LAYER A — closing message: closes the product story. */}
          <div className="grid grid-cols-1 gap-8 px-6 py-9 md:grid-cols-[65fr_35fr] md:items-center md:px-10 md:py-10 lg:px-14 lg:py-12">
            <div className="min-w-0">
              <h2 className="max-w-[640px] text-3xl leading-[1.15] font-bold tracking-tight text-white md:text-4xl">
                <span className="block">{tHero("headlineLine1")}</span>
                <span className="block">{t("headlineLine2")}</span>
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/60 md:text-lg">{t("proposition")}</p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none sm:w-auto"
              >
                {tHeader("cta")} <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/demo"
                className="text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline-none"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* LAYER B — one footer navigation system: brand left, product nav + languages
              sharing a right-aligned cluster/baseline, with the quiet legal line below
              separated by spacing only (no second divider). */}
          <div className="flex flex-col gap-3 px-6 py-6 md:px-10 lg:px-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                  AT
                </div>
                <span className="text-sm font-semibold tracking-wide text-white/90">AUTOMATION</span>
              </Link>

              <div className="flex flex-wrap items-center gap-4 md:gap-5">
                <nav aria-label={t("navLabel")} className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <a
                    href="#capabilities"
                    className="rounded-full px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                  >
                    {t("capabilities")}
                  </a>
                  <a
                    href="#integrations"
                    className="rounded-full px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                  >
                    {t("integrations")}
                  </a>
                  <Link
                    href="/demo"
                    className="rounded-full px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                  >
                    {t("liveDemo")}
                  </Link>
                </nav>

                <ul
                  role="listbox"
                  aria-label={tHeader("languageSwitcherLabel")}
                  className="flex flex-wrap items-center gap-1 sm:border-l sm:border-white/10 sm:pl-4"
                >
                  {routing.locales.map((lang) => (
                    <li key={lang}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === currentLang}
                        onClick={() => selectLanguage(lang)}
                        className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
                          lang === currentLang ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
              <span>{t("copyright", { year: new Date().getFullYear() })}</span>
              <span aria-hidden="true" className="text-white/20">
                ·
              </span>
              <span>{t("privacy")}</span>
              <span aria-hidden="true" className="text-white/20">
                ·
              </span>
              <span>{t("legal")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
