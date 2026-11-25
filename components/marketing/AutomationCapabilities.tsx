import { getTranslations } from "next-intl/server";
import { CAPABILITY_CATEGORY_KEYS } from "@/lib/marketing-data";
import { DashboardIcon, ChevronDownIcon } from "@/components/dashboard/icons";

const CAPABILITY_ICONS: Record<(typeof CAPABILITY_CATEGORY_KEYS)[number], string> = {
  salesCustomers: "users",
  operations: "activity",
  inventorySupply: "box",
  finance: "coins",
  documents: "receipt",
  communication: "message",
  managementReporting: "chart",
  aiAutomation: "sparkle",
};

/**
 * "What AT can automate" — a compact capability map, not a feature-dump grid. Sits directly
 * after the dashboard preview in the landing flow (see page.tsx). Server component: no
 * interactivity is needed here, matching the Hero above it.
 */
export default async function AutomationCapabilities() {
  const t = await getTranslations("Capabilities");

  return (
    <section className="px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-20 lg:px-12 xl:pt-12 xl:pb-14">
      <div id="capabilities" className="mx-auto max-w-7xl scroll-mt-[var(--anchor-offset)]">
        <div className="max-w-2xl text-center sm:text-left">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("headline")}</h2>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">{t("body")}</p>
        </div>

        {/* Mobile capability disclosures — native HTML, no client JavaScript. */}
        <div className="mt-7 flex flex-col gap-2 md:hidden">
          {CAPABILITY_CATEGORY_KEYS.map((key) => {
            const examples = t.raw(`categories.${key}.examples`) as string[];
            return (
              <details key={key} className="group rounded-xl border border-border bg-surface">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <DashboardIcon name={CAPABILITY_ICONS[key]} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-center text-sm font-semibold text-foreground">
                    {t(`categories.${key}.title`)}
                  </span>
                  <ChevronDownIcon className="h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <div className="border-t border-border px-4 pt-3 pb-4 text-center">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {t(`categories.${key}.description`)}
                  </p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {examples.map((example) => (
                      <li key={example} className="flex items-baseline justify-center gap-2 text-center text-sm text-neutral-600">
                        <span aria-hidden="true" className="text-accent">·</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            );
          })}
        </div>

        <div className="mt-7 hidden gap-3 md:mt-8 md:grid md:grid-cols-2 xl:grid-cols-4">
          {CAPABILITY_CATEGORY_KEYS.map((key) => {
            const examples = t.raw(`categories.${key}.examples`) as string[];
            return (
              <div key={key} className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 md:p-6">
                <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <DashboardIcon name={CAPABILITY_ICONS[key]} className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t(`categories.${key}.title`)}</h3>
                <p className="text-sm leading-snug text-neutral-600">{t(`categories.${key}.description`)}</p>
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {examples.map((example) => (
                    <li key={example} className="flex items-baseline gap-2 text-sm leading-snug text-neutral-600">
                      <span aria-hidden="true" className="text-accent">
                        ·
                      </span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
