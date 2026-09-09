import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import {
  AUTOMATION_DEFINITIONS,
  AUTOMATION_RUNS,
  getActiveAutomationCount,
  getAutomatedTodayStats,
  getAutomationsNeedingAttentionCount,
  type AutomationDefinition,
} from "@/lib/demo-data";
import AutomationDetailPanel from "./AutomationDetailPanel";
import { formatAutomationTimestamp, getAutomationRunEntityLabel } from "./automationFormatters";

const STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-neutral-200 text-neutral-600",
  needsAttention: "bg-warning/10 text-warning",
};

const COLUMN_WIDTHS = ["20%", "14%", "19%", "18%", "11%", "18%"];

// Below @6xl (1152px container width — the same breakpoint established for Finance/Operations'
// tablet-open tables this session) with the inspector open, the ~420px AutomationDetailPanel
// leaves too little room for even the 5-column wide-open set below: Automation/Trigger squeeze
// down far enough to wrap ugly. A second, smaller table (own colgroup, table-fixed) takes over at
// that width — Automation + Status only, the two columns that stay genuinely useful next to an
// open automation inspector — CSS-toggled via @6xl exactly like Finance/Operations' own tablet
// tables, gated by the same isInspectorOpen boolean already used across every migrated module.
const MIN_TABLE_WIDTH_OPEN_NARROW = 260;
// 58/42 rather than a more Automation-heavy split — measured against the longest status label in
// the dataset, "Needs attention" (~104px unconstrained), which still clips inside 32% of even a
// 342px rendered table; Automation names have comfortable slack at 58% (the longest, "Overdue
// invoice follow-up", never truncates down to MIN_TABLE_WIDTH_OPEN_NARROW).
const COLUMN_WIDTHS_OPEN_NARROW = ["58%", "42%"];

// Wide-open (≥@6xl) compact set: Last run drops out — it's the least essential column at a
// glance, and every execution timestamp is already visible inside the open inspector's own
// Recent executions list — while Automation/Area/Status/Trigger/Runs today keep the closed
// table's own relative proportions, rebalanced to fill 100% of the narrower open-state width.
const MIN_TABLE_WIDTH_OPEN_WIDE = 560;
const COLUMN_WIDTHS_OPEN_WIDE = ["28%", "15%", "18%", "24%", "15%"];

// Below @6xl (1152px container width) with the inspector CLOSED, the full 6-column table
// (Automation/Area/Status/Trigger/Runs today/Last run) squeezes "Runs today" down far enough that
// its own header text wraps vertically letter-by-letter — a real bug. A second, narrower table
// (own colgroup, table-fixed) takes over at that width, mirroring Finance's own CLOSED_TABLET
// table: Automation/Status/Trigger/Runs today only. Area and Last run drop out — Area duplicates
// what the automation name already implies, and Last run is a supplementary timestamp, not a
// decision-driving fact — freeing enough room for Runs today to render on one line.
// Status gets a heavier share than a first pass suggests: "Needs attention" (~104px unconstrained)
// still clips inside a narrower pill column, so 28% is sized to that worst case, not the shorter
// "Active"/"Paused" labels.
const MIN_TABLE_WIDTH_CLOSED_TABLET = 460;
const COLUMN_WIDTHS_CLOSED_TABLET = ["26%", "28%", "26%", "20%"];

/**
 * Desktop-only Automations workspace (Stage 2F.1, made presentational in 2F.2). Hidden below the
 * @5xl container-query breakpoint, matching every other module's own desktop-foundation stage.
 * Selection state (selectedId/selectedAutomation) is owned by AutomationsWorkspace and passed in,
 * mirroring InventoryDesktop's prop-driven pattern — this component only renders.
 *
 * Every KPI here is derived, never a re-typed literal: activeAutomations/needsAttention come from
 * AUTOMATION_DEFINITIONS' own status field, and automatedToday/timeSavedToday reuse the Command
 * Center's existing KPI_ITEMS entry via getAutomatedTodayStats() — the 7 definitions below are
 * workflow *types*, not the 186 executions counted there, so they must never be summed and shown
 * as a second "automated today" figure.
 */
export default function AutomationsDesktop({
  selectedId,
  onSelectRow,
  selectedAutomation,
  onCloseDetail,
}: {
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedAutomation: AutomationDefinition | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Automations");
  const tApprovals = useTranslations("Dashboard.Approvals");
  // The desktop inspector is open exactly when an automation is selected — mirroring
  // CustomersTable/InventoryTable/FinanceTable/OperationsTable's identical isInspectorOpen idiom.
  const isInspectorOpen = selectedAutomation !== null;

  const activeCount = getActiveAutomationCount();
  const needsAttentionCount = getAutomationsNeedingAttentionCount();
  const automatedToday = getAutomatedTodayStats();

  const summaryItems = [
    { key: "activeAutomations", value: String(activeCount), tone: "text-accent" },
    { key: "automatedToday", value: automatedToday.count, tone: "text-accent" },
    { key: "timeSavedToday", value: automatedToday.hoursSaved, tone: "text-success" },
    { key: "needsAttention", value: String(needsAttentionCount), tone: needsAttentionCount > 0 ? "text-warning" : "text-accent" },
  ] as const;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectRow(id);
    }
  };

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header — no greeting: that belongs only to Command Center. */}
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main workspace: automation table + recent activity (closed) or automation table +
          inspector (open) — a real flex row, not an overlay, so the inspector genuinely takes
          420px of width instead of being painted over the table/aside underneath (the bug fixed
          for Customers/Inventory/Finance/Operations this session). Recent activity is hidden
          while the inspector is open rather than squeezed to near-nothing alongside it: every
          automation's own recent executions already live inside the open inspector itself (see
          AutomationInspectorBody), so the cross-automation feed is redundant screen space at that
          moment, not missing information — and dropping it gives the table the room it actually
          needs, mirroring how Finance/Operations drop secondary columns rather than squeeze them. */}
      <div className="flex min-h-0 flex-1 gap-4">
        <div
          className={`min-h-0 min-w-0 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5 ${
            isInspectorOpen ? "flex-1" : "flex-[4]"
          }`}
        >
          {isInspectorOpen ? (
            <table
              className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
              style={{ minWidth: `${MIN_TABLE_WIDTH_OPEN_NARROW}px` }}
            >
              <colgroup>
                {COLUMN_WIDTHS_OPEN_NARROW.map((width, index) => (
                  <col key={index} style={{ width }} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-border text-xs text-neutral-500">
                  <th className="px-4 py-3 font-medium">{t("table.automation")}</th>
                  <th className="px-4 py-3 text-center font-medium">{t("table.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AUTOMATION_DEFINITIONS.map((automation) => {
                  const isSelected = automation.id === selectedId;
                  return (
                    <tr
                      key={automation.id}
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => onSelectRow(automation.id)}
                      onKeyDown={(event) => handleRowKeyDown(event, automation.id)}
                      className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                        isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="truncate px-4 py-3 font-semibold text-foreground">
                        {t(`definitions.${automation.key}.name`)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[automation.status]}`}
                        >
                          {t(`status.${automation.status}`)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table
              className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
              style={{ minWidth: `${MIN_TABLE_WIDTH_CLOSED_TABLET}px` }}
            >
              <colgroup>
                {COLUMN_WIDTHS_CLOSED_TABLET.map((width, index) => (
                  <col key={index} style={{ width }} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-border text-xs text-neutral-500">
                  <th className="px-4 py-3 font-medium">{t("table.automation")}</th>
                  <th className="px-4 py-3 font-medium">{t("table.status")}</th>
                  <th className="px-4 py-3 font-medium">{t("table.trigger")}</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.runsToday")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AUTOMATION_DEFINITIONS.map((automation) => {
                  const isSelected = automation.id === selectedId;
                  return (
                    <tr
                      key={automation.id}
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => onSelectRow(automation.id)}
                      onKeyDown={(event) => handleRowKeyDown(event, automation.id)}
                      className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                        isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="px-4 py-3 align-top font-semibold break-words text-foreground">
                        {t(`definitions.${automation.key}.name`)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[automation.status]}`}
                        >
                          {t(`status.${automation.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top break-words text-neutral-600">
                        {t(`definitions.${automation.key}.trigger`)}
                      </td>
                      <td className="px-4 py-3 text-right align-top font-medium whitespace-nowrap text-foreground">
                        {automation.runsToday}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <table
            className={`hidden w-full table-fixed border-collapse text-left text-sm @6xl:table`}
            style={isInspectorOpen ? { minWidth: `${MIN_TABLE_WIDTH_OPEN_WIDE}px` } : undefined}
          >
            <colgroup>
              {(isInspectorOpen ? COLUMN_WIDTHS_OPEN_WIDE : COLUMN_WIDTHS).map((width, index) => (
                <col key={index} style={{ width }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-border text-xs text-neutral-500">
                <th className="px-4 py-3 font-medium">{t("table.automation")}</th>
                <th className="px-4 py-3 font-medium">{t("table.area")}</th>
                <th className="px-4 py-3 font-medium">{t("table.status")}</th>
                <th className="px-4 py-3 font-medium">{t("table.trigger")}</th>
                <th className="px-4 py-3 text-right font-medium break-words">{t("table.runsToday")}</th>
                {!isInspectorOpen && (
                  <th className="px-4 py-3 text-right font-medium break-words">{t("table.lastRun")}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {AUTOMATION_DEFINITIONS.map((automation) => {
                const isSelected = automation.id === selectedId;
                return (
                  <tr
                    key={automation.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onSelectRow(automation.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, automation.id)}
                    className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                      isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <td className="px-4 py-3 align-top font-semibold break-words text-foreground">
                      {t(`definitions.${automation.key}.name`)}
                    </td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">
                      {t(`category.${automation.category}`)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-medium break-words ${STATUS_TONE[automation.status]}`}
                      >
                        {t(`status.${automation.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">
                      {t(`definitions.${automation.key}.trigger`)}
                    </td>
                    <td className="px-4 py-3 text-right align-top font-medium whitespace-nowrap text-foreground">
                      {automation.runsToday}
                    </td>
                    {!isInspectorOpen && (
                      <td className="px-4 py-3 text-right align-top text-xs whitespace-nowrap text-neutral-400">
                        {formatAutomationTimestamp(automation.lastRun, t)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isInspectorOpen && (
          <div className="flex min-h-0 flex-[1] min-w-[240px] flex-col overflow-hidden rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="mb-2 shrink-0 text-xs font-semibold text-foreground">{t("recentActivity.title")}</p>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {AUTOMATION_RUNS.map((run) => {
                const automation = AUTOMATION_DEFINITIONS.find((item) => item.id === run.automationId);
                if (!automation) return null;
                const entityLabel = getAutomationRunEntityLabel(run, tApprovals);

                return (
                  <div key={run.id} className="flex items-start justify-between gap-2 rounded-lg border border-border/60 px-2 py-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-xs font-semibold text-foreground">{t(`definitions.${automation.key}.name`)}</p>
                      {entityLabel && <p className="break-words text-xs text-neutral-500">{entityLabel}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xs ${run.status === "attention" ? "font-medium text-warning" : "text-neutral-400"}`}>
                        {t(`runStatus.${run.status}`)}
                      </p>
                      <p className="mt-0.5 text-[11px] whitespace-nowrap text-neutral-400">
                        {formatAutomationTimestamp(run.timestamp, t)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedAutomation && <AutomationDetailPanel automation={selectedAutomation} onClose={onCloseDetail} />}
      </div>
    </div>
  );
}
