"use client";

import { useLocale, useTranslations } from "next-intl";
import { INTEGRATION_CATEGORIES } from "@/lib/marketing-data";
import { routing } from "@/i18n/routing";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type LanguageCode = (typeof routing.locales)[number];

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

/**
 * Marketing Footer — a light, full-width closing utility strip, not a floating card and not a
 * second marketing section. It's a direct continuation of IntegrationEcosystem's own `bg-surface`
 * white (same color, no card, no negative-margin trick), so it reads as the tail of the same
 * surface Architecture card sits on rather than a separate block appended below it.
 *
 * Two layers, one hairline between them:
 *   Row 1 (primary) — brand/owner identity (real person + location, no logo icon: the mark
 *   already appears in Header and functionally in Architecture card) and real navigation
 *   (Capabilities/Integrations/Demo — the only page nav anywhere on the site, since Header has
 *   none).
 *   Row 2+3 (secondary/quietest, separated from Row 1 by the one hairline, from each other by
 *   spacing only) — System Types (a short reference list of the real Integrations.categories
 *   labels, deliberately grouped into rows via chunk() rather than one flowing wrapped
 *   paragraph or a bordered grid/table) and the copyright/legal/languages utility line.
 *
 * No marketing headline, no CTA: Architecture card already closes the story; repeating it here
 * would be the same idea a third time on an already-short page.
 *
 * KNOWN BLOCKER (unrelated to this component, not fixed here): Header's primary CTA still links
 * to `#contact`, and no `id="contact"` exists anywhere on the site — tracked separately.
 */
export default function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const tIntegrations = useTranslations("Integrations");
  const currentLang = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();

  const selectLanguage = (lang: LanguageCode) => {
    router.replace(pathname, { locale: lang });
  };

  const categoryLabels = INTEGRATION_CATEGORIES.map((category) => tIntegrations(`categories.${category.key}`));
  const categoryLinesMobile = chunk(categoryLabels, 2).map((group) => group.join(" · "));
  const categoryLinesDesktop = chunk(categoryLabels, 4).map((group) => group.join(" · "));

  return (
    <footer className="bg-[#F7F8FA]">
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-12 md:px-8 lg:px-12">
        {/* Row 1 — identity + navigation (primary layer) */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold tracking-wide text-foreground">AT AUTOMATION</p>
            <p className="text-sm text-neutral-600">Tsiurupa Andrii</p>
            <p className="text-sm text-neutral-500">Lugano, Switzerland</p>
            <a
              href="https://www.linkedin.com/in/andrii-tsiurupa-ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-sm text-neutral-600 transition-colors hover:text-foreground"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>

          <nav aria-label={t("navLabel")} className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href="#capabilities" className="text-sm text-neutral-600 transition-colors hover:text-foreground">
              {t("capabilities")}
            </a>
            <a href="#integrations" className="text-sm text-neutral-600 transition-colors hover:text-foreground">
              {t("integrations")}
            </a>
            <Link href="/demo" className="text-sm text-neutral-600 transition-colors hover:text-foreground">
              {t("liveDemo")}
            </Link>
          </nav>
        </div>

        {/* Row 2+3 — reference + utility (secondary/quietest layer), one hairline above, no
            second divider between the two rows below it. */}
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("systemTypesLabel")}</p>

          <div className="mt-3 flex flex-col gap-1.5 md:hidden">
            {categoryLinesMobile.map((line) => (
              <p key={line} className="text-sm text-neutral-700">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-3 hidden flex-col gap-1.5 md:flex">
            {categoryLinesDesktop.map((line) => (
              <p key={line} className="text-sm text-neutral-700">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-neutral-500">
              <span>{t("copyright", { year: new Date().getFullYear() })}</span>
              <div className="flex flex-wrap items-center gap-x-4">
                <span>{t("privacy")}</span>
                <span>{t("legal")}</span>
              </div>
            </div>

            <ul role="listbox" aria-label={tHeader("languageSwitcherLabel")} className="flex flex-wrap items-center gap-1">
              {routing.locales.map((lang) => (
                <li key={lang}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={lang === currentLang}
                    onClick={() => selectLanguage(lang)}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none ${
                      lang === currentLang ? "bg-black/5 text-foreground" : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
