import { useTranslations } from "next-intl";
import { NEEDS_ATTENTION } from "@/lib/demo-data";
import { DashboardIcon } from "@/components/dashboard/icons";

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
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name="list" className="h-4 w-4" />
        </span>
        {t("title")}
      </h3>

      <ul className="mt-3 flex flex-1 flex-col divide-y divide-slate-100">
        {NEEDS_ATTENTION.map((item) => {
          const title = tAttention(`items.${item.key}.title`, {
            ...("count" in item && { count: item.count }),
            ...("operationId" in item && { id: item.operationId }),
          });
          const note = tAttention(`notes.${item.noteKey}`);

          return (
            <li key={item.key}>
              <div className="flex items-center gap-3 py-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] ${SEVERITY_CHIP[item.severity]}`}
                >
                  <DashboardIcon name={ITEM_ICON[item.key]} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 leading-[1.15]">
                  <span className="block text-xs font-semibold text-slate-900">{title}</span>
                  <span className="mt-1 block text-[11px] text-slate-500">{note}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
