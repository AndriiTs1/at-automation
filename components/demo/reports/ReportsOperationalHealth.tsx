import { useTranslations } from "next-intl";
import { getOperationalHealth } from "@/lib/demo-data";

/**
 * Compact cross-module management summary (Stage 2H.1) — one meaningful state per module, each
 * read from getOperationalHealth() rather than re-typed here. Row labels reuse the existing
 * Dashboard.Sidebar module names (same nouns the nav already uses) instead of a second set of
 * module-name translations. The Finance row reuses Dashboard.Kpi's existing "{count} overdue"
 * phrase — identical concept to Command Center's own Cash Due KPI delta — rather than a new key.
 */
export default function ReportsOperationalHealth() {
  const t = useTranslations("Dashboard.Reports");
  const tKpi = useTranslations("Dashboard.Kpi");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const health = getOperationalHealth();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <h4 className="mb-2 shrink-0 text-sm font-semibold text-foreground">{t("operationalHealth.title")}</h4>
      <div className="flex flex-1 flex-col divide-y divide-border overflow-y-auto">
        {health.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-2 py-2 first:pt-0">
            <span className="truncate text-sm font-medium text-foreground">{tSidebar(`items.${item.key}`)}</span>
            <span className="shrink-0 text-sm text-neutral-500">
              {item.key === "finance"
                ? tKpi("overdue", { count: item.value })
                : t(`operationalHealth.items.${item.key}`, { count: item.value })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
