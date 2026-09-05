import { getTranslations } from "next-intl/server";
import { CAPABILITY_CATEGORY_KEYS } from "@/lib/marketing-data";

/**
 * "What AT can automate" — a compact capability map, not a feature-dump grid. Sits directly
 * after the interactive Demo showcase in the landing flow (see page.tsx). Server component:
 * no interactivity is needed here, matching the Hero/Bridge sections it follows.
 */
export default async function AutomationCapabilities() {
  const t = await getTranslations("Capabilities");

  return (
    <section id="capabilities" className="scroll-mt-16 px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-20 lg:px-12 xl:pt-12 xl:pb-14">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("headline")}</h2>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">{t("body")}</p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-8 md:grid-cols-2 xl:grid-cols-4">
          {CAPABILITY_CATEGORY_KEYS.map((key, index) => {
            const examples = t.raw(`categories.${key}.examples`) as string[];
            return (
              <div key={key} className="flex flex-col gap-1.5 bg-background p-4 md:p-5">
                <p className="font-mono text-xs text-neutral-400">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="text-base font-semibold text-foreground">{t(`categories.${key}.title`)}</h3>
                <p className="text-sm leading-snug text-neutral-600">{t(`categories.${key}.description`)}</p>
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {examples.map((example) => (
                    <li key={example} className="flex items-baseline gap-2 text-sm leading-snug text-neutral-500">
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
