import { useTranslations } from "next-intl";
import { NEEDS_ATTENTION } from "@/lib/demo-data";
import { ChevronDownIcon, DashboardIcon } from "./icons";

const ITEM_ICON: Record<string, string> = {
  overdueInvoices: "receipt",
  lowStockItems: "box",
  operationDelayed: "activity",
  automationRunsFailed: "bolt",
};

const SEVERITY_CHIP: Record<string, string> = {
  critical: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
};

/**
 * Compact executive summary inspired by Germes Procurement Needs — an icon chip + concise label +
 * secondary context per row, not the full three-line Needs Attention treatment. Reuses the exact
 * same NEEDS_ATTENTION records and translations as the full component below it in the operational
 * layer; this is a different, denser presentation of the same data, not a duplicate data source.
 */
export default function ActionRequired() {
  const t = useTranslations("Dashboard.ActionRequired");
  const tAttention = useTranslations("Dashboard.Attention");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @3xl:p-4">
      <h3 className="truncate text-center text-[13px] font-semibold tracking-tight text-slate-900 @3xl:text-sm">{t("title")}</h3>

      <ul className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto">
        {NEEDS_ATTENTION.map((item) => {
          const title = tAttention(`items.${item.key}.title`, {
            ...("count" in item && { count: item.count }),
            ...("operationId" in item && { id: item.operationId }),
          });
          const note = tAttention(`notes.${item.noteKey}`);

          return (
            <li key={item.key}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-1 py-0.5 text-left transition-colors hover:bg-slate-50"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] ${SEVERITY_CHIP[item.severity]}`}
                >
                  <DashboardIcon name={ITEM_ICON[item.key]} className="h-3 w-3" />
                </span>
                <span className="min-w-0 flex-1 leading-[1.15]">
                  <span className="block truncate text-[11.5px] font-semibold text-slate-900">{title}</span>
                  <span className="block truncate text-[9.5px] text-slate-400">{note}</span>
                </span>
                <ChevronDownIcon className="h-3 w-3 shrink-0 -rotate-90 text-slate-300" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
