"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useQuerySelection } from "@/components/demo/useQuerySelection";
import {
  AUTOMATION_DEFINITIONS,
  getActiveAutomationCount,
  getAutomatedTodayStats,
  getAutomationsNeedingAttentionCount,
} from "@/lib/demo-data";
import AutomationDetailMobile from "./AutomationDetailMobile";
import AutomationsDesktop from "./AutomationsDesktop";
import AutomationsMobileList from "./AutomationsMobileList";

/**
 * Compact 2x2 KPI grid shared by the mobile and tablet Automations sections (Stage 2F.4) — the
 * same 4 approved page-level figures as desktop's summary row, read from the same helpers
 * (getActiveAutomationCount/getAutomatedTodayStats/getAutomationsNeedingAttentionCount), never a
 * re-typed literal. Mirrors InventoryWorkspace/FinanceWorkspace's own SummaryGrid pattern.
 */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Automations");
  const activeCount = getActiveAutomationCount();
  const needsAttentionCount = getAutomationsNeedingAttentionCount();
  const automatedToday = getAutomatedTodayStats();

  const items = [
    { key: "activeAutomations", value: String(activeCount), tone: "text-accent" },
    { key: "automatedToday", value: automatedToday.count, tone: "text-accent" },
    { key: "timeSavedToday", value: automatedToday.hoursSaved, tone: "text-success" },
    { key: "needsAttention", value: String(needsAttentionCount), tone: needsAttentionCount > 0 ? "text-warning" : "text-accent" },
  ] as const;

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.key} className="rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
          <p className="text-xs leading-tight text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className={`mt-1 text-lg font-bold ${item.tone}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Top-level Automations workspace — owns selectedAutomationId and resolves the selected
 * AutomationDefinition, mirroring InventoryWorkspace/CustomersWorkspace's ownership pattern.
 * Fans out to three breakpoint-gated presentations (mobile / tablet / desktop), like every other
 * module's own Workspace, while AUTOMATION_DEFINITIONS stays the single, unfiltered source of
 * truth shared by all three — there is still no filtering in this stage (2F.3 was deliberately
 * skipped), so this Escape handler stays simpler than Inventory's: there's no open dropdown that
 * could compete for the same keypress.
 *
 * Desktop is untouched from Stage 2F.2 (AutomationsDesktop + its own 420px AutomationDetailPanel).
 * Mobile and tablet share the same AutomationsMobileList + AutomationDetailMobile — only the
 * surrounding header markup differs (mobile: compact title only; tablet: title + description),
 * matching Finance/Inventory's own mobile-vs-tablet header convention exactly. The global Recent
 * Activity panel is desktop-only by deliberate decision (see AutomationsDesktop) — every
 * automation's own recent executions already live in AutomationDetailContent, so reproducing the
 * whole cross-automation feed again above/below a 7-item list would be redundant length on a
 * small screen, not missing information.
 */
export default function AutomationsWorkspace() {
  const t = useTranslations("Dashboard.Automations");
  // Stage 2J.2 — record-level deep link (e.g. from the Scenario page). This module has no
  // filters, so AUTOMATION_DEFINITIONS is already the full dataset selection always resolves
  // against — nothing else to change beyond reading the param. selectedId's own lazy initializer
  // picks this up on first mount (a direct page load); the prevAutomationParam diff below catches
  // later changes (client-side navigation while already mounted). Applied during render rather
  // than in an effect, since setState-in-effect causes an avoidable extra render pass.
  const [automationParam, clearAutomationParam] = useQuerySelection("automation");
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    automationParam && AUTOMATION_DEFINITIONS.some((automation) => automation.id === automationParam)
      ? automationParam
      : null,
  );
  const [prevAutomationParam, setPrevAutomationParam] = useState(automationParam);
  if (automationParam !== prevAutomationParam) {
    setPrevAutomationParam(automationParam);
    if (automationParam && AUTOMATION_DEFINITIONS.some((automation) => automation.id === automationParam)) {
      setSelectedId(automationParam);
    }
  }

  const selectedAutomation = AUTOMATION_DEFINITIONS.find((automation) => automation.id === selectedId) ?? null;
  // useCallback keeps this reference stable across renders (as long as clearAutomationParam
  // itself stays stable, which useQuerySelection already guarantees) so the Escape effect below
  // can safely list it as a dependency without re-attaching its listener every render.
  const closeDetail = useCallback(() => {
    setSelectedId(null);
    clearAutomationParam();
  }, [clearAutomationParam]);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDetail();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, closeDetail]);

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <p className="text-base font-semibold text-foreground">{t("title")}</p>
        <SummaryGrid />
        <AutomationsMobileList selectedId={selectedId} onSelect={setSelectedId} />
        {selectedAutomation && <AutomationDetailMobile automation={selectedAutomation} onClose={closeDetail} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <SummaryGrid />
        <AutomationsMobileList selectedId={selectedId} onSelect={setSelectedId} />
        {selectedAutomation && <AutomationDetailMobile automation={selectedAutomation} onClose={closeDetail} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2F.2 */}
      <AutomationsDesktop
        selectedId={selectedId}
        onSelectRow={setSelectedId}
        selectedAutomation={selectedAutomation}
        onCloseDetail={closeDetail}
      />
    </>
  );
}
