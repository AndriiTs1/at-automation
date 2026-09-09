import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { INTEGRATION_DEFINITIONS, getIntegrationCounts, type IntegrationDefinition } from "@/lib/demo-data";
import IntegrationDetailPanel from "./IntegrationDetailPanel";
import { formatLastSync, systemDisplayName } from "./integrationFormatters";

// Restrained enterprise status treatment — a small colored dot carries the semantic color, text
// stays a plain neutral tone, rather than the heavier rounded colored-pill/badge look. Dot tone
// carries the semantic color; text tone is a secondary emphasis cue (connected/demo read as
// "live", ready/notConnected read as more muted), never a second saturated color.
const STATUS_DOT_TONE: Record<string, string> = {
  connected: "bg-success",
  demo: "bg-accent",
  ready: "bg-neutral-400",
  notConnected: "bg-neutral-300",
};

const STATUS_TEXT_TONE: Record<string, string> = {
  connected: "text-foreground",
  demo: "text-foreground",
  ready: "text-neutral-600",
  notConnected: "text-neutral-400",
};

const CATEGORY_ORDER = ["erp", "crm", "accounting", "warehouse", "payments", "ecommerce", "email", "internal"] as const;
const MODULE_ORDER = ["operations", "finance", "inventory", "customers", "automations"] as const;

const COLUMN_WIDTHS = ["16%", "10%", "17%", "10%", "26%", "21%"];

// Below @6xl (1152px container width — the same breakpoint established for Automations/Finance's
// own open-state tables) with the inspector open, even the 4-column wide-open set below leaves too
// little room: System/Business data squeeze down far enough to clip behind the 420px
// IntegrationDetailPanel. A second, smaller table (own colgroup, table-fixed) takes over at that
// width — System + Status only, mirroring AutomationsDesktop's identical OPEN_NARROW idiom.
// Status needs a heavier share than Automations' own OPEN_NARROW split: the longest status label
// here, "Ready for integration" (~131px unconstrained), is notably longer than any Automations
// status, so System/Status split 46/54 rather than 58/42 to keep it from clipping.
const MIN_TABLE_WIDTH_OPEN_NARROW = 300;
const COLUMN_WIDTHS_OPEN_NARROW = ["46%", "54%"];

// Wide-open (≥@6xl) compact set: Category and Used by drop out — Category is implied by the
// system's own name for this dataset, and Used by is already visible inside the open inspector's
// own "Used across AT" list — while Business data keeps a generous share since its values (up to
// 4 items joined by " · ") are the longest content in the table and need room to wrap cleanly.
const MIN_TABLE_WIDTH_OPEN_WIDE = 620;
const COLUMN_WIDTHS_OPEN_WIDE = ["24%", "16%", "14%", "46%"];

/**
 * Desktop-only Integrations workspace (Stage 2G.1, made presentational in 2G.2). Hidden below the
 * @5xl container-query breakpoint, matching every other module's own desktop-foundation stage.
 * Selection state (selectedId/selectedIntegration) is owned by IntegrationsWorkspace and passed
 * in, mirroring AutomationsDesktop's prop-driven pattern — this component only renders.
 *
 * All counts are derived from INTEGRATION_DEFINITIONS via getIntegrationCounts() — never a
 * re-typed literal — and every automation/module reference resolves live rather than duplicating
 * a business fact already owned by Automations/Finance/Inventory/etc.
 */
export default function IntegrationsDesktop({
  selectedId,
  onSelectRow,
  selectedIntegration,
  onCloseDetail,
}: {
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedIntegration: IntegrationDefinition | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  // The desktop inspector is open exactly when an integration is selected — mirroring
  // AutomationsDesktop/InventoryDesktop's identical isInspectorOpen idiom.
  const isInspectorOpen = selectedIntegration !== null;

  const counts = getIntegrationCounts();

  const summaryItems = [
    { key: "connected", value: String(counts.connected), tone: "text-success" },
    { key: "ready", value: String(counts.ready), tone: "text-accent" },
    { key: "demo", value: String(counts.demo), tone: "text-accent" },
    { key: "businessSystems", value: String(counts.total), tone: "text-foreground" },
  ] as const;

  const moduleLabel = (key: string) => (key === "automations" ? tSidebar("items.automations") : tAutomations(`category.${key}`));

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

      {/* System landscape — business systems -> AT -> business workflows, in one compact strip. */}
      <div className="mb-4 shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
        <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("landscape.title")}</p>
        <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-neutral-500">{t("landscape.businessSystemsLabel")}</p>
            <p className="mt-0.5 text-sm break-words text-foreground">
              {CATEGORY_ORDER.map((key) => t(`category.${key}`)).join(" · ")}
            </p>
          </div>
          <span aria-hidden="true" className="text-neutral-300">
            →
          </span>
          <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-accent">
            {t("landscape.atLayerLabel")}
          </span>
          <span aria-hidden="true" className="text-neutral-300">
            →
          </span>
          <div className="min-w-0">
            <p className="text-xs text-neutral-500">{t("landscape.workflowsLabel")}</p>
            <p className="mt-0.5 text-sm break-words text-foreground">
              {MODULE_ORDER.map((key) => moduleLabel(key)).join(" · ")}
            </p>
          </div>
        </div>
      </div>

      {/* Integration list + inspector — a real flex row, not an overlay, so the inspector
          genuinely takes 420px of width instead of being painted over the table underneath (the
          bug fixed for Automations/Inventory/Finance's own DetailInspectorShell migration). */}
      <div className="relative flex min-h-0 flex-1">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
          {isInspectorOpen && (
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
                  <th className="px-4 py-3 font-medium">{t("table.system")}</th>
                  <th className="px-4 py-3 text-center font-medium">{t("table.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INTEGRATION_DEFINITIONS.map((integration) => {
                  const isSelected = integration.id === selectedId;
                  return (
                    <tr
                      key={integration.id}
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => onSelectRow(integration.id)}
                      onKeyDown={(event) => handleRowKeyDown(event, integration.id)}
                      className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                        isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="truncate px-4 py-3 font-semibold text-foreground">
                        {systemDisplayName(integration, t)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex max-w-full items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_TONE[integration.status]}`}
                          />
                          <span className={`truncate text-xs font-medium ${STATUS_TEXT_TONE[integration.status]}`}>
                            {t(`status.${integration.status}`)}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <table
            className={`w-full table-fixed border-collapse text-left text-sm ${isInspectorOpen ? "hidden @6xl:table" : ""}`}
            style={isInspectorOpen ? { minWidth: `${MIN_TABLE_WIDTH_OPEN_WIDE}px` } : undefined}
          >
            <colgroup>
              {(isInspectorOpen ? COLUMN_WIDTHS_OPEN_WIDE : COLUMN_WIDTHS).map((width, index) => (
                <col key={index} style={{ width }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-border text-xs text-neutral-500">
                <th className="px-4 py-3 font-medium">{t("table.system")}</th>
                {!isInspectorOpen && <th className="px-4 py-3 font-medium">{t("table.category")}</th>}
                <th className="px-4 py-3 text-center font-medium">{t("table.status")}</th>
                <th className="px-4 py-3 text-center font-medium">{t("table.direction")}</th>
                <th className="px-4 py-3 font-medium">{t("table.businessData")}</th>
                {!isInspectorOpen && <th className="px-4 py-3 font-medium">{t("table.usedBy")}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INTEGRATION_DEFINITIONS.map((integration) => {
                const isSelected = integration.id === selectedId;
                return (
                  <tr
                    key={integration.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onSelectRow(integration.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, integration.id)}
                    className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                      isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <td className="px-4 py-3 align-top font-semibold break-words text-foreground">
                      {systemDisplayName(integration, t)}
                    </td>
                    {!isInspectorOpen && (
                      <td className="px-4 py-3 align-top break-words text-neutral-600">
                        {t(`category.${integration.category}`)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center align-top">
                      <span className="inline-flex max-w-full items-start gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_TONE[integration.status]}`}
                        />
                        <span className={`break-words text-xs font-medium ${STATUS_TEXT_TONE[integration.status]}`}>
                          {t(`status.${integration.status}`)}
                        </span>
                      </span>
                      <p className="mt-1 text-xs break-words text-neutral-400">
                        {formatLastSync(integration.lastSync, t, tAutomations)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center align-top break-words text-neutral-600">
                      {t(`direction.${integration.direction}`)}
                    </td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">
                      {integration.dataFlowKeys.map((key) => t(`dataFlow.${key}`)).join(" · ")}
                    </td>
                    {!isInspectorOpen && (
                      <td className="px-4 py-3 align-top break-words text-neutral-600">
                        {(integration.relatedModuleKeys ?? []).map((key) => moduleLabel(key)).join(" · ")}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedIntegration && (
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
            <IntegrationDetailPanel integration={selectedIntegration} onClose={onCloseDetail} />
          </>
        )}
      </div>
    </div>
  );
}
