import { useTranslations } from "next-intl";
import { NEEDS_ATTENTION } from "@/lib/demo-data";
import { ChevronDownIcon } from "./icons";

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-error",
  warning: "bg-warning",
};

export default function MobileNeedsAttention() {
  const t = useTranslations("Dashboard.Attention");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
      <div className="mb-1 flex shrink-0 items-center justify-between">
        <h4 className="truncate text-xs font-semibold text-foreground">{t("title")}</h4>
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-error/10 px-1.5 text-[10px] font-semibold text-error">
          {NEEDS_ATTENTION.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-border/60 overflow-y-auto">
        {NEEDS_ATTENTION.map((item) => {
          const title = t(`items.${item.key}.title`, {
            ...("count" in item && { count: item.count }),
            ...("operationId" in item && { id: item.operationId }),
          });
          const meta = t(`items.${item.key}.meta`, {
            ...("amount" in item && { amount: item.amount }),
            ...("deptKey" in item && { dept: tTeams(item.deptKey) }),
            ...("categories" in item && { categories: item.categories }),
            ...("days" in item && { days: item.days }),
          });
          const owner = "ownerKey" in item ? tTeams(item.ownerKey) : item.ownerName;
          const note = t(`notes.${item.noteKey}`);

          return (
            <button
              key={item.key}
              type="button"
              className="flex items-center gap-2 py-2 text-left transition-colors first:pt-0.5 last:pb-0.5 hover:bg-black/[0.03]"
            >
              <span className={`h-2 w-2 shrink-0 self-start rounded-full ${SEVERITY_DOT[item.severity]}`} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] leading-snug font-semibold text-foreground">{title}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-neutral-500">{meta}</span>
                <span className="mt-0.5 block text-[10px] leading-snug text-neutral-500/80">
                  {t("ownerLabel", { owner })} · {note}
                </span>
              </span>
              <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 -rotate-90 self-center text-neutral-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
