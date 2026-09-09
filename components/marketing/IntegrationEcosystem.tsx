import { getTranslations } from "next-intl/server";
import Image from "next/image";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

/**
 * "Systems AT can connect with" — a single premium architecture diagram (your systems → the AT
 * layer → your team), directly adjacent to AutomationCapabilities. The section ends right after
 * the diagram: no brand/system names are named here, so integrations never become the page's
 * main theme. The full catalogue stays in lib/marketing-data.ts for a future dedicated
 * integrations page; compatibility proof will live in the Footer as a separate follow-up.
 */
function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

export default async function IntegrationEcosystem() {
  const t = await getTranslations("Integrations");
  const systemsItems = t.raw("architecture.systemsItems") as string[];
  const teamItems = t.raw("architecture.teamItems") as string[];
  const systemsCompactLines = chunk(systemsItems, 3).map((group) => group.join(" · "));
  const teamCompactLine = teamItems.join(" · ");

  return (
    <section
      id="integrations"
      className="scroll-mt-16 bg-surface px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-16 lg:px-12 xl:pt-12 xl:pb-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl text-center sm:text-left">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("headline")}</h2>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">{t("body")}</p>
        </div>

        {/* Architecture card: your systems -> the AT layer -> your team */}
        <div className="mt-8 rounded-2xl border border-border bg-background p-5 md:mt-10 md:p-6">
          <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1.2fr_auto_1fr] sm:items-center sm:gap-4 md:gap-6">
            <div className="w-full text-center sm:text-left">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                {t("architecture.systemsLabel")}
              </p>
              {/* Mobile: compact grouped lines instead of one row per item */}
              <div className="mt-2 flex flex-col items-center gap-0.5 sm:hidden">
                {systemsCompactLines.map((line) => (
                  <p key={line} className="text-sm text-foreground">
                    {line}
                  </p>
                ))}
              </div>
              {/* Tablet/desktop: one item per line */}
              <ul className="hidden sm:mt-2.5 sm:flex sm:flex-col sm:gap-1">
                {systemsItems.map((item) => (
                  <li key={item} className="text-sm leading-tight text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ArrowDownIcon className="h-3.5 w-3.5 shrink-0 text-neutral-300 sm:hidden" />
            <ArrowIcon className="hidden h-3.5 w-3.5 shrink-0 self-center text-neutral-300 sm:block" />

            <div className="flex shrink-0 flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt=""
                width={86}
                height={86}
                className="h-14 w-14 object-contain md:h-20 md:w-20"
              />
              <p className="mt-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                AT Automation
              </p>
              <p className="mt-1 text-xs text-neutral-500">{t("architecture.centerTagline")}</p>
            </div>

            <ArrowDownIcon className="h-3.5 w-3.5 shrink-0 text-neutral-300 sm:hidden" />
            <ArrowIcon className="hidden h-3.5 w-3.5 shrink-0 self-center text-neutral-300 sm:block" />

            <div className="w-full text-center sm:text-right">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                {t("architecture.teamLabel")}
              </p>
              {/* Mobile: single compact line */}
              <p className="mt-2 text-sm text-foreground sm:hidden">{teamCompactLine}</p>
              {/* Tablet/desktop: one item per line */}
              <ul className="hidden sm:mt-2.5 sm:flex sm:flex-col sm:items-end sm:gap-1">
                {teamItems.map((item) => (
                  <li key={item} className="text-sm leading-tight text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
