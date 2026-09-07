import { useTranslations } from "next-intl";
import { getReportsKpis } from "@/lib/demo-data";
import ReportsBusinessPerformance from "./ReportsBusinessPerformance";
import ReportsManagementHighlights from "./ReportsManagementHighlights";
import ReportsOperationalHealth from "./ReportsOperationalHealth";

/**
 * Desktop-only Reports workspace (Stage 2H.1 — foundation). Hidden below the @5xl container-query
 * breakpoint, matching every other module's own desktop-foundation stage. No selection/detail
 * state: this stage has no drill-down, so there is nothing to lift into a parent Workspace yet.
 *
 * Layout mirrors Command Center's own desktop grid: Business Performance (65%) + Operational
 * Health (35%) on top, Management Highlights full width below — the same proven 65/35 split
 * already used for Performance + Needs Attention, not a new layout invented for this page.
 */
export default function ReportsDesktop() {
  const t = useTranslations("Dashboard.Reports");
  const tPerformance = useTranslations("Dashboard.Performance");
  const tKpi = useTranslations("Dashboard.Kpi");
  const kpis = getReportsKpis();

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header — no greeting: that belongs only to Command Center. */}
      <div className="mb-1 shrink-0">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
      </div>

      {/* Period context — static; reuses the exact same "Last 30 days" label Command Center's
          own Business Performance chart already shows, rather than a second period concept. No
          date picker, no compare control (foundation stage). */}
      <div className="mb-4 shrink-0">
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs text-neutral-500">
          {tPerformance("rangeLabel")}
        </span>
      </div>

      {/* KPI row — no icons, no sparklines, no fake badges. */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {kpis.map((kpi) => {
          const secondary =
            kpi.deltaKind === "percent" && kpi.deltaValue
              ? kpi.deltaValue
              : kpi.deltaKind === "overdue"
                ? tKpi("overdue", { count: kpi.deltaCount ?? 0 })
                : null;
          const secondaryTone =
            kpi.deltaKind === "percent" ? "text-success" : kpi.deltaKind === "overdue" ? "text-error" : "text-neutral-400";

          return (
            <div key={kpi.key} className="min-w-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
              <p className="truncate text-xs text-neutral-500">{t(`kpi.${kpi.key}`)}</p>
              <div className="mt-1 flex min-w-0 items-baseline gap-1.5">
                <p className="shrink-0 text-xl font-bold whitespace-nowrap text-foreground">{kpi.value}</p>
                {secondary && <span className={`min-w-0 truncate text-xs font-medium ${secondaryTone}`}>{secondary}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[3fr_2fr] gap-3">
        <div className="grid min-h-0 grid-cols-[65fr_35fr] gap-3">
          <div className="h-full min-h-0">
            <ReportsBusinessPerformance />
          </div>
          <div className="h-full min-h-0">
            <ReportsOperationalHealth />
          </div>
        </div>
        <div className="h-full min-h-0">
          <ReportsManagementHighlights />
        </div>
      </div>
    </div>
  );
}
