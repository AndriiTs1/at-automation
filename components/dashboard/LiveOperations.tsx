import { useTranslations } from "next-intl";
import { LIVE_OPERATIONS } from "@/lib/demo-data";

export default function LiveOperations() {
  const t = useTranslations("Dashboard.LiveOperations");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5 @3xl:p-4">
      <div className="mb-1.5 flex shrink-0 items-center justify-between @3xl:mb-2">
        <h4 className="truncate text-xs font-semibold text-foreground @3xl:text-sm">{t("title")}</h4>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {t("live")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto @3xl:gap-2.5">
        {LIVE_OPERATIONS.map((event) => (
          <div key={event.time + event.titleKey} className="flex gap-2 text-[11px] @3xl:text-xs">
            <span className="shrink-0 pt-0.5 font-mono text-[10px] text-neutral-400 @3xl:text-[11px]">{event.time}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground @lg:truncate">{t(`events.${event.titleKey}`, event.titleParams)}</p>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {event.steps.map((step) => (
                  <p key={step.key} className="truncate text-[10px] text-neutral-500 @3xl:text-[11px]">
                    <span className="text-neutral-300">→</span> {t(`steps.${step.key}`, "params" in step ? step.params : undefined)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
