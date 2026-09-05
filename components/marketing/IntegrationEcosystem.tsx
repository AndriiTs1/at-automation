import { getTranslations } from "next-intl/server";
import { INTEGRATION_CATEGORIES } from "@/lib/marketing-data";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

/**
 * "Systems AT can connect with" — distinct (bg-surface band) but directly adjacent to
 * AutomationCapabilities, reinforcing "keep your systems; AT connects them" without a wall
 * of logos or a claim that every listed integration ships today (see exampleNote copy).
 */
export default async function IntegrationEcosystem() {
  const t = await getTranslations("Integrations");

  return (
    <section className="bg-surface px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-20 lg:px-12 xl:pt-12 xl:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("headline")}</h2>
            <p className="mt-3 max-w-xl text-base text-neutral-600 md:text-lg">{t("body")}</p>
          </div>

          <div className="flex flex-col items-center gap-1 text-center lg:col-span-2">
            <div>
              <p className="text-sm font-medium text-neutral-600">{t("flow.systemsLabel")}</p>
              <p className="text-xs text-neutral-500">{t("flow.systemsExamples")}</p>
            </div>
            <ChevronDownIcon className="my-1 h-4 w-4 shrink-0 text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-accent">AT</p>
              <p className="text-xs text-neutral-500">{t("flow.atExamples")}</p>
            </div>
            <ChevronDownIcon className="my-1 h-4 w-4 shrink-0 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-600">{t("flow.teamsLabel")}</p>
              <p className="text-xs text-neutral-500">{t("flow.teamsExamples")}</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm font-medium text-neutral-500 md:mt-9">{t("exampleNote")}</p>

        <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
          {INTEGRATION_CATEGORIES.map((category) => (
            <div
              key={category.key}
              className="flex flex-col gap-1 px-5 py-3 md:flex-row md:items-baseline md:gap-6 md:px-6 md:py-3.5"
            >
              <p className="shrink-0 text-xs font-semibold tracking-wide text-neutral-500 uppercase md:w-40">
                {t(`categories.${category.key}`)}
              </p>
              <p className="text-sm text-foreground">
                {category.examples.map((example, index) => (
                  <span key={"brand" in example ? example.brand : example.genericKey}>
                    {index > 0 && (
                      <span aria-hidden="true" className="mx-1.5 text-neutral-300">
                        ·
                      </span>
                    )}
                    {"brand" in example ? example.brand : t(`generic.${example.genericKey}`)}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
