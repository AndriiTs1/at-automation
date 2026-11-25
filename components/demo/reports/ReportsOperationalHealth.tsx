import { useTranslations } from "next-intl";
import { DashboardIcon } from "@/components/dashboard/icons";

const HEALTH_ICONS: Record<string, string> = {
  operations: "activity",
  customers: "users",
  inventory: "box",
  finance: "coins",
  automations: "bolt",
};
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
      <div className="mb-3 flex shrink-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name="activity" className="h-5 w-5" />
        </span>
        <h4 className="text-sm font-semibold text-foreground">{t("operationalHealth.title")}</h4>
      </div>
      <div className="flex flex-1 flex-col divide-y divide-border overflow-y-auto">
        {health.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-2 py-2 first:pt-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <DashboardIcon name={HEALTH_ICONS[item.key] ?? "activity"} className="h-4 w-4" />
              </span>
              <span className="min-w-0 break-words text-sm font-medium text-foreground">
                {tSidebar(`items.${item.key}`)}
              </span>
            </div>
            <span className={`text-right text-xs font-medium ${
              item.key === "operations"
                ? "text-accent"
                : item.value === 0
                  ? "text-success"
                  : item.key === "finance"
                    ? "text-error"
                    : "text-warning"
            }`}>
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
