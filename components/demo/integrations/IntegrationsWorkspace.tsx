"use client";

import { useTranslations } from "next-intl";
import { DashboardIcon } from "@/components/dashboard/icons";
import { useEffect, useState } from "react";
import { getIntegrationCounts, INTEGRATION_DEFINITIONS } from "@/lib/demo-data";
import IntegrationDetailMobile from "./IntegrationDetailMobile";
import IntegrationsDesktop from "./IntegrationsDesktop";
import IntegrationsMobileList from "./IntegrationsMobileList";

import {
  CATEGORY_ORDER,
  MODULE_ORDER,
  CATEGORY_ICONS,
  MODULE_ICONS,
  LAYER_FEATURES,
} from "./landscapeConfig";

/**
 * Compact 2x2 (mobile) or 4-column (tablet, where it fits) KPI grid — the same 4 approved
 * page-level figures as desktop's summary row, read from getIntegrationCounts(), never a
 * re-typed literal. Mirrors AutomationsWorkspace's own SummaryGrid pattern; `columns` lets the
 * tablet branch below try 4-across (2G.3 section 5 prefers 4 columns where it stays clean) while
 * mobile stays 2x2.
 */
function SummaryGrid({ columns = 2 }: { columns?: 2 | 4 }) {
  const t = useTranslations("Dashboard.Integrations");
  const counts = getIntegrationCounts();

  const items = [
    { key: "connected", value: String(counts.connected), tone: "text-success" },
    { key: "ready", value: String(counts.ready), tone: "text-accent" },
    { key: "demo", value: String(counts.demo), tone: "text-accent" },
    { key: "businessSystems", value: String(counts.total), tone: "text-foreground" },
  ] as const;

  return (
    <div className={`grid shrink-0 gap-2 ${columns === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
      {items.map((item) => (
        <div key={item.key} className="min-w-0 rounded-xl border border-border bg-surface p-2.5 text-center shadow-sm shadow-black/5">
          <p className="text-xs leading-tight break-words text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className={`mt-1 text-lg font-bold ${item.tone}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact vertical System Landscape for tablet/mobile (Stage 2G.3) — the same "business systems
 * -> AT -> business workflows" concept as desktop's horizontal strip, re-flowed vertically since
 * the desktop's 3-column horizontal layout does not fit narrower containers cleanly. Reads the
 * same CATEGORY_ORDER/MODULE_ORDER lists as the desktop landscape — no duplicated business facts.
 */
function CompactLandscape() {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const moduleLabel = (key: string) =>
    key === "automations"
      ? tSidebar("items.automations")
      : tAutomations(`category.${key}`);

  return (
    <section className="shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">

      <div className="mb-3 text-center">
        <h2 className="text-base font-semibold text-foreground">
          {t("landscape.title")}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          {t("landscape.description")}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-[#F7F9FC] p-2.5">

        {/* Business systems */}
        <h3 className="mb-2 text-center text-xs font-semibold tracking-wide text-[#39577D] uppercase">
          {t("landscape.businessSystemsLabel")}
        </h3>

        <div className="grid grid-cols-2 gap-1.5 @lg:grid-cols-4">
          {CATEGORY_ORDER.map((key) => (
            <div
              key={key}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-[#DCE3EB] text-center bg-white px-2 py-1.5 @lg:flex-col @lg:justify-center @lg:gap-1 @lg:py-2 @lg:text-center"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EDF2F8]">
                <DashboardIcon
                  name={CATEGORY_ICONS[key]}
                  className="h-4 w-4 text-[#39577D]"
                />
              </span>
              <span className="min-w-0 flex-1 break-words text-center text-xs font-medium text-[#26374A] @lg:flex-none">
                {t(`category.${key}`)}
              </span>
            </div>
          ))}
        </div>

        {/* Vertical connector */}
        <div aria-hidden="true" className="flex h-7 items-center justify-center">
          <svg viewBox="0 0 24 28" fill="none" className="h-7 w-6">
            <path
              d="M12 2V24M7 19L12 24L17 19"
              stroke="#8CA4BF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* AT Integration Layer */}
        <div className="mx-auto w-full rounded-xl bg-[#39577D] p-3 text-white shadow-sm @lg:max-w-[85%] @lg:px-4">

          <div className="flex flex-col items-center gap-1.5 @lg:flex-row @lg:justify-center @lg:gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10">
              <DashboardIcon name="network" className="h-5 w-5" />
            </span>
            <h3 className="text-center text-base font-bold @lg:text-lg">
              {t("landscape.atLayerLabel")}
            </h3>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-white/20 pt-2">
            {LAYER_FEATURES.map(({ key, icon }) => (
              <div
                key={key}
                className="flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.08] text-center px-1.5 py-2 @lg:justify-center @lg:gap-2 @lg:px-3 @lg:text-center"
              >
                <DashboardIcon
                  name={icon}
                  className="h-4 w-4 shrink-0 text-[#C4D9F1]"
                />
                <span className="min-w-0 flex-1 break-words text-center text-xs leading-snug text-white @lg:flex-none @lg:text-sm">
                  {t(`landscape.${key}`)}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Vertical connector */}
        <div aria-hidden="true" className="flex h-7 items-center justify-center">
          <svg viewBox="0 0 24 28" fill="none" className="h-7 w-6">
            <path
              d="M12 2V24M7 19L12 24L17 19"
              stroke="#8CA4BF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Business workflows */}
        <h3 className="mb-2 text-center text-xs font-semibold tracking-wide text-[#39577D] uppercase">
          {t("landscape.workflowsLabel")}
        </h3>

        <div className="grid grid-cols-2 gap-1.5 @lg:grid-cols-5">
          {MODULE_ORDER.map((key) => (
            <div
              key={key}
              className={`flex min-w-0 items-center gap-2 rounded-lg border border-[#DCE3EB] text-center bg-white px-2 py-1.5 @lg:flex-col @lg:justify-center @lg:gap-1 @lg:py-2 @lg:text-center ${key === "automations" ? "col-span-2 justify-center @lg:col-span-1" : ""}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EDF2F8]">
                <DashboardIcon
                  name={MODULE_ICONS[key]}
                  className="h-4 w-4 text-[#39577D]"
                />
              </span>
              <span className="min-w-0 flex-1 break-words text-center text-xs font-medium text-[#26374A] @lg:flex-none">
                {moduleLabel(key)}
              </span>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs leading-relaxed text-neutral-500">
        <DashboardIcon name="info" className="h-3.5 w-3.5 shrink-0" />
        <span className="text-center">{t("landscape.demoNote")}</span>
      </div>

    </section>
  );
}

/**
 * Top-level Integrations workspace — owns selectedIntegrationId and resolves the selected
 * IntegrationDefinition, mirroring AutomationsWorkspace's ownership pattern. Fans out to three
 * breakpoint-gated presentations (mobile / tablet / desktop), like every other module's own
 * Workspace, while INTEGRATION_DEFINITIONS stays the single, unfiltered source of truth shared
 * by all three — there is still no filtering in this stage, so this Escape handler stays simple:
 * there's no open dropdown that could compete for the same keypress.
 *
 * Desktop is untouched from Stage 2G.2 (IntegrationsDesktop + its own 420px IntegrationDetailPanel).
 * Mobile and tablet share the same IntegrationsMobileList + IntegrationDetailMobile — only the
 * surrounding header/summary-column-count markup differs (mobile: compact title only, 2x2 KPIs;
 * tablet: title + description, 4-column KPIs), matching Finance/Inventory/Automations' own
 * mobile-vs-tablet header convention exactly.
 */
export default function IntegrationsWorkspace() {
  const t = useTranslations("Dashboard.Integrations");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedIntegration = INTEGRATION_DEFINITIONS.find((integration) => integration.id === selectedId) ?? null;
  const closeDetail = () => setSelectedId(null);

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <SummaryGrid columns={2} />
        <CompactLandscape />
        <IntegrationsMobileList selectedId={selectedId} onSelect={setSelectedId} />
        {selectedIntegration && <IntegrationDetailMobile integration={selectedIntegration} onClose={closeDetail} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <SummaryGrid columns={4} />
        <CompactLandscape />
        <IntegrationsMobileList selectedId={selectedId} onSelect={setSelectedId} />
        {selectedIntegration && <IntegrationDetailMobile integration={selectedIntegration} onClose={closeDetail} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2G.2 */}
      <IntegrationsDesktop
        selectedId={selectedId}
        onSelectRow={setSelectedId}
        selectedIntegration={selectedIntegration}
        onCloseDetail={closeDetail}
      />
    </>
  );
}
