import { useTranslations } from "next-intl";
import { getAutomatedTodayStats, getAutomationRunsByCategory } from "@/lib/demo-data";

/**
 * Compact executive card inspired by Germes Cash Flow's hierarchy (title / big number / muted
 * subtitle / bare bottom-anchored visualization). AT has no real historical automation-over-time
 * series, so rather than fabricate a time-dependent trend line, the visualization is a bar-per-
 * category breakdown of today's real runsToday figures (getAutomationRunsByCategory) — a
 * genuinely different, deterministic metric from the 186/14.2h totals above it, not a second
 * attempt at the same number.
 */
export default function AutomationImpact() {
  const t = useTranslations("Dashboard.AutomationImpact");
  const tKpi = useTranslations("Dashboard.Kpi");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const stats = getAutomatedTodayStats();
  const breakdown = getAutomationRunsByCategory();
  const maxRuns = Math.max(...breakdown.map((entry) => entry.runsToday));
  const summary = breakdown.map((entry) => `${tSidebar(`items.${entry.category}`)} ${entry.runsToday}`).join(", ");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @3xl:p-4">
      <h3 className="truncate text-[13px] font-semibold tracking-tight text-slate-900 @3xl:text-sm">{t("title")}</h3>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-lg leading-none font-semibold tracking-tight text-slate-900 @3xl:text-xl">
          {stats.count}
        </span>
        <span className="text-[11px] leading-none font-medium text-success @3xl:text-xs">
          {tKpi("saved", { hours: stats.hoursSaved })}
        </span>
      </div>
      <p className="mt-1 truncate text-[10.5px] text-slate-400 @3xl:text-[11px]">{t("subtitle")}</p>

      <div
        className="mt-auto flex h-11 items-end gap-2 pt-2 @3xl:h-14 @3xl:gap-3"
        role="img"
        aria-label={summary}
      >
        {breakdown.map((entry) => (
          <div key={entry.category} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1">
            <div
              className="w-full rounded-t-[3px] bg-accent"
              style={{ height: `${Math.max((entry.runsToday / maxRuns) * 100, 8)}%` }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-1 flex gap-2 @3xl:gap-3">
        {breakdown.map((entry) => (
          <span key={entry.category} className="min-w-0 flex-1 truncate text-center text-[9px] text-slate-400 @3xl:text-[10px]">
            {tSidebar(`items.${entry.category}`)}
          </span>
        ))}
      </div>
    </div>
  );
}
