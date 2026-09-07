"use client";

import { useTranslations } from "next-intl";
import { getReportsKpis } from "@/lib/demo-data";
import ReportsBusinessPerformance from "./ReportsBusinessPerformance";
import ReportsDesktop from "./ReportsDesktop";
import ReportsManagementHighlights from "./ReportsManagementHighlights";
import ReportsOperationalHealth from "./ReportsOperationalHealth";

/**
 * Compact KPI grid shared by the mobile (2 columns) and tablet (4 columns, or 2 if a long locale
 * makes 4 genuinely cramped) Reports sections (Stage 2H.2) — the same 4 approved KPIs as
 * desktop's own summary row, read from the same getReportsKpis() helper, never re-typed. Kept as
 * a separate implementation rather than extracted out of ReportsDesktop, mirroring Automations/
 * Finance/Integrations' own established SummaryGrid pattern: desktop's summary row stays
 * completely untouched (see spec section 11), this is purely additive. Stacks label/value/delta
 * on three lines (rather than desktop's inline value+delta) so nothing needs `truncate` at any
 * card width — every value/delta wraps instead.
 */
function KpiGrid({ columns }: { columns: 2 | 4 }) {
  const t = useTranslations("Dashboard.Reports");
  const tKpi = useTranslations("Dashboard.Kpi");
  const kpis = getReportsKpis();

  return (
    <div className={`grid shrink-0 gap-2 ${columns === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
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
          <div key={kpi.key} className="min-w-0 rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
            <p className="text-xs leading-tight break-words text-neutral-500">{t(`kpi.${kpi.key}`)}</p>
            <p className="mt-1 text-lg leading-tight font-bold break-words text-foreground">{kpi.value}</p>
            {secondary && <p className={`mt-0.5 text-xs leading-tight font-medium break-words ${secondaryTone}`}>{secondary}</p>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Top-level Reports workspace — fans out to three breakpoint-gated presentations (mobile /
 * tablet / desktop), like every other module's own Workspace. No selection/detail state: this
 * stage still has no drill-down, so there is nothing to lift or share across branches beyond the
 * read-only report helpers all three already call directly.
 *
 * Mobile deliberately reorders content relative to desktop (KPIs → Operational Health →
 * Management Highlights → Business Performance, chart last) rather than copying desktop's
 * vertical order — on a phone the Managing Director should see "what needs attention" before
 * reaching the larger historical chart (see spec section 3). Tablet keeps the chart in strong
 * visual priority (full width, near the top) with Health + Highlights sharing the row below,
 * rather than force-fitting desktop's 65/35 composition into a narrower, taller viewport.
 *
 * Desktop is untouched from Stage 2H.1 (ReportsDesktop is self-gated behind `@5xl:flex` and
 * rendered unconditionally here, exactly like AutomationsDesktop/IntegrationsDesktop).
 */
export default function ReportsWorkspace() {
  const t = useTranslations("Dashboard.Reports");
  const tPerformance = useTranslations("Dashboard.Performance");

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <p className="text-base font-semibold text-foreground">{t("title")}</p>
        <span className="inline-flex w-fit items-center rounded-full border border-border px-2.5 py-1 text-xs text-neutral-500">
          {tPerformance("rangeLabel")}
        </span>
        <KpiGrid columns={2} />
        <div className="h-64 shrink-0">
          <ReportsOperationalHealth />
        </div>
        <div className="h-56 shrink-0">
          <ReportsManagementHighlights />
        </div>
        <div className="h-64 shrink-0">
          <ReportsBusinessPerformance compact />
        </div>
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-border px-2.5 py-1 text-xs text-neutral-500">
          {tPerformance("rangeLabel")}
        </span>
        <KpiGrid columns={4} />
        <div className="h-72 shrink-0">
          <ReportsBusinessPerformance />
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <div className="h-72">
            <ReportsOperationalHealth />
          </div>
          <div className="h-72">
            <ReportsManagementHighlights />
          </div>
        </div>
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2H.1 */}
      <ReportsDesktop />
    </>
  );
}
