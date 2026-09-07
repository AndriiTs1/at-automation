"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getIntegrationCounts, INTEGRATION_DEFINITIONS } from "@/lib/demo-data";
import IntegrationDetailMobile from "./IntegrationDetailMobile";
import IntegrationsDesktop from "./IntegrationsDesktop";
import IntegrationsMobileList from "./IntegrationsMobileList";

const CATEGORY_ORDER = ["erp", "crm", "accounting", "warehouse", "payments", "ecommerce", "email", "internal"] as const;
const MODULE_ORDER = ["operations", "finance", "inventory", "customers", "automations"] as const;

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
        <div key={item.key} className="min-w-0 rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
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

  const moduleLabel = (key: string) => (key === "automations" ? tSidebar("items.automations") : tAutomations(`category.${key}`));

  return (
    <div className="shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("landscape.title")}</p>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div>
          <p className="text-xs text-neutral-500">{t("landscape.businessSystemsLabel")}</p>
          <p className="mt-0.5 text-sm break-words text-foreground">
            {CATEGORY_ORDER.map((key) => t(`category.${key}`)).join(" · ")}
          </p>
        </div>
        <span aria-hidden="true" className="text-neutral-300">
          ↓
        </span>
        <span className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-accent">
          {t("landscape.atLayerLabel")}
        </span>
        <span aria-hidden="true" className="text-neutral-300">
          ↓
        </span>
        <div>
          <p className="text-xs text-neutral-500">{t("landscape.workflowsLabel")}</p>
          <p className="mt-0.5 text-sm break-words text-foreground">
            {MODULE_ORDER.map((key) => moduleLabel(key)).join(" · ")}
          </p>
        </div>
      </div>
    </div>
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
        <p className="text-base font-semibold text-foreground">{t("title")}</p>
        <SummaryGrid columns={2} />
        <CompactLandscape />
        <IntegrationsMobileList selectedId={selectedId} onSelect={setSelectedId} />
        {selectedIntegration && <IntegrationDetailMobile integration={selectedIntegration} onClose={closeDetail} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
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
