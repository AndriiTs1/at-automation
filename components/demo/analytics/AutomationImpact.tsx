import { DashboardIcon } from "@/components/dashboard/icons";
import { useTranslations } from "next-intl";
import { getAutomationRunsByCategory } from "@/lib/demo-data";

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
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const breakdown = getAutomationRunsByCategory();
  const sampleTotal = breakdown.reduce(
    (sum, entry) => sum + entry.runsToday, 0
  );
  const maxRuns = Math.max(...breakdown.map((entry) => entry.runsToday));
  const summary = breakdown.map((entry) => `${tSidebar(`items.${entry.category}`)} ${entry.runsToday}`).join(", ");

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name="bolt" className="h-4 w-4" />
        </span>
        {t("title")}
      </h3>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-xl leading-tight font-semibold tracking-tight text-slate-900 @3xl:text-xl">
          {sampleTotal}
        </span>

      </div>
      <p className="mt-1 text-[10.5px] text-slate-500 @3xl:text-[11px]">{t("subtitle")}</p>

      <div className="mt-3 space-y-2" role="img" aria-label={summary}>
        {breakdown.map((entry) => (
          <div key={entry.category}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-600">{tSidebar(`items.${entry.category}`)}</span>
              <span className="font-semibold tabular-nums text-slate-900">{entry.runsToday}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-accent"
                style={{ width: `${maxRuns > 0 ? entry.runsToday / maxRuns * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
