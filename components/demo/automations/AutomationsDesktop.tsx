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

      {/* Main workspace: automation list (~70%) + recent activity (~30%); `relative` so the
          detail panel below can overlay this whole row from the right without resizing it. */}
      <div className="relative flex min-h-0 flex-1 gap-4">
        <div className="min-h-0 min-w-0 flex-[4] overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <colgroup>
              {COLUMN_WIDTHS.map((width, index) => (
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
                <th className="px-4 py-3 text-right font-medium break-words">{t("table.lastRun")}</th>
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
                    <td className="px-4 py-3 text-right align-top text-xs whitespace-nowrap text-neutral-400">
                      {formatAutomationTimestamp(automation.lastRun, t)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

        {selectedAutomation && (
          <>
            {/* Subtle workspace-level scrim — communicates layering without darkening the app or
                blocking recognition of the table underneath. Decorative: X and Escape are the
                primary close mechanisms, so this stays out of tab order and hidden from AT. */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={onCloseDetail}
              className="absolute inset-0 z-10 cursor-default bg-black/[0.02]"
            />
            <AutomationDetailPanel automation={selectedAutomation} onClose={onCloseDetail} />
          </>
        )}
      </div>
    </div>
  );
}
