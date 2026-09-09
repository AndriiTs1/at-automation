import { useTranslations } from "next-intl";
import { getIntegrationAutomations, type IntegrationDefinition } from "@/lib/demo-data";
import { CloseIcon } from "@/components/dashboard/icons";
import { formatLastSync, systemDisplayName } from "./integrationFormatters";

const STATUS_TONE: Record<string, string> = {
  connected: "bg-success/10 text-success",
  demo: "bg-accent/10 text-accent",
  ready: "bg-neutral-200 text-neutral-600",
  notConnected: "bg-neutral-100 text-neutral-400",
};

const MODULE_ORDER = ["operations", "finance", "inventory", "customers", "automations"] as const;

// Mirrors IntegrationsDesktop's own STATUS_DOT_TONE — a small colored dot carries the semantic
// color instead of a rounded pill background. Kept as its own local copy rather than importing
// from IntegrationsDesktop.tsx, matching this file's existing STATUS_TONE duplication convention
// (a desktop-table file and a shared detail-content file intentionally don't import from each
// other for one small color map).
const STATUS_DOT_TONE: Record<string, string> = {
  connected: "bg-success",
  demo: "bg-accent",
  ready: "bg-neutral-400",
  notConnected: "bg-neutral-300",
};

/**
 * Shared Integration Detail body (Stage 2G.2) — header, connection status explanation, data
 * flow, a compact visual module-usage flow, dependent automations, and last activity.
 * Deliberately free of any desktop-specific positioning (no `absolute`/fixed width) so it can be
 * reused unchanged inside a future mobile/tablet overlay (Stage 2G.3), exactly as
 * AutomationDetailContent/InventoryDetailContent are shared between their own desktop panel and
 * mobile overlay. Every fact is read live from the IntegrationDefinition passed in and from
 * getIntegrationAutomations — nothing here duplicates systemName/category/status/direction/
 * dataFlowKeys/usedByAutomationIds/relatedModuleKeys/lastSync as a second record.
 */
export default function IntegrationDetailContent({
  integration,
  onClose,
}: {
  integration: IntegrationDefinition;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const moduleLabel = (key: string) => (key === "automations" ? tSidebar("items.automations") : tAutomations(`category.${key}`));
  const modules = (integration.relatedModuleKeys ?? []).filter((key): key is (typeof MODULE_ORDER)[number] =>
    (MODULE_ORDER as readonly string[]).includes(key),
  );
  const automations = getIntegrationAutomations(integration);
  const showLastActivity = (integration.status === "connected" || integration.status === "demo") && integration.lastSync;

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="text-base font-semibold break-words text-foreground">{systemDisplayName(integration, t)}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium break-words ${STATUS_TONE[integration.status]}`}
            >
              {t(`status.${integration.status}`)}
            </span>
            <span className="text-xs text-neutral-500">{t(`category.${integration.category}`)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("detail.close")}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
        {/* Connection status explanation */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.connectionStatus")}
          </p>
          <p className="text-sm break-words text-foreground">{t(`connectionExplanation.${integration.status}`)}</p>
        </div>

        {/* Data flow */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.dataFlow")}</p>
          <p className="text-sm break-words text-foreground">{t(`direction.${integration.direction}`)}</p>
          <p className="mt-1 text-sm break-words text-neutral-600">
            {integration.dataFlowKeys.map((key) => t(`dataFlow.${key}`)).join(" · ")}
          </p>
        </div>

        {/* Compact visual: system -> AT -> the AT modules that use it */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.moduleUsage")}</p>
          <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 px-3 py-3 text-center">
            <p className="text-sm font-semibold break-words text-foreground">{systemDisplayName(integration, t)}</p>
            <span aria-hidden="true" className="text-neutral-300">
              ↓
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold whitespace-nowrap text-accent">
              {t("landscape.atLayerLabel")}
            </span>
            <span aria-hidden="true" className="text-neutral-300">
              ↓
            </span>
            <p className="text-sm break-words text-neutral-600">
              {modules.length > 0 ? modules.map((key) => moduleLabel(key)).join(" · ") : "—"}
            </p>
          </div>
        </div>

        {/* Automations using this integration */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.automationsUsing")}
          </p>
          {automations.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noAutomations")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {automations.map((automation) => (
                <p key={automation.id} className="px-3 py-2 text-sm break-words text-foreground">
                  {tAutomations(`definitions.${automation.key}.name`)}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Last activity — connected/demo only, never fabricated for ready/notConnected */}
        {showLastActivity && (
          <div>
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              {t("detail.lastActivity")}
            </p>
            <p className="text-sm break-words text-foreground">{formatLastSync(integration.lastSync, t, tAutomations)}</p>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Desktop inspector header — composed directly by IntegrationDetailPanel into
 * DetailInspectorShell's `header` slot; mirrors AutomationInspectorHeader/CustomerInspectorHeader's
 * plain-text status line (no colored pill) rather than the default export's pill-based header
 * above, which stays untouched and keeps serving IntegrationDetailMobile exactly as before. Not
 * part of the default IntegrationDetailContent export.
 */
export function IntegrationInspectorHeader({ integration }: { integration: IntegrationDefinition }) {
  const t = useTranslations("Dashboard.Integrations");
  return (
    <>
      <p className="truncate text-lg font-semibold text-foreground">{systemDisplayName(integration, t)}</p>
      <p className="mt-1.5 text-xs text-neutral-500">
        {t(`status.${integration.status}`)} · {t(`category.${integration.category}`)}
      </p>
    </>
  );
}

/**
 * Mobile inspector header — composed by IntegrationDetailMobile into DetailInspectorShell's
 * (variant="mobile") `header` slot. Same plain-text "status · category" line as
 * IntegrationInspectorHeader above, plus a small semantic status dot in front of it — the same
 * restrained dot+text status language IntegrationsDesktop's table now uses, replacing the old
 * rounded status pill the mobile view used to show. Kept as its own export, separate from
 * IntegrationInspectorHeader, so desktop's header stays byte-for-byte unchanged.
 */
export function IntegrationMobileInspectorHeader({ integration }: { integration: IntegrationDefinition }) {
  const t = useTranslations("Dashboard.Integrations");
  return (
    <>
      <p className="truncate text-lg font-semibold text-foreground">{systemDisplayName(integration, t)}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_TONE[integration.status]}`} />
        <p className="text-xs text-neutral-500">
          {t(`status.${integration.status}`)} · {t(`category.${integration.category}`)}
        </p>
      </div>
    </>
  );
}

/**
 * Desktop inspector body — composed directly by IntegrationDetailPanel into DetailInspectorShell's
 * `children` slot. Reads the same IntegrationDefinition fields as the default export above
 * (direction/lastSync/dataFlowKeys/relatedModuleKeys/getIntegrationAutomations) but drops the
 * demo-explanatory `connectionExplanation` copy and the large "used by AT" system → AT → modules
 * diagram — the desktop System Landscape strip above the table already explains that architecture
 * once, so repeating it per-row inside the inspector was redundant. Connection direction and last
 * sync collapse into one compact "Connection" section (rather than a separate "Last activity"
 * section further down), and used-by modules render as a plain vertical list instead of a nested
 * bordered card, matching the restrained row/separator language of the other refined inspectors.
 */
export function IntegrationInspectorBody({ integration }: { integration: IntegrationDefinition }) {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const moduleLabel = (key: string) => (key === "automations" ? tSidebar("items.automations") : tAutomations(`category.${key}`));
  const modules = (integration.relatedModuleKeys ?? []).filter((key): key is (typeof MODULE_ORDER)[number] =>
    (MODULE_ORDER as readonly string[]).includes(key),
  );
  const automations = getIntegrationAutomations(integration);

  return (
    <>
      {/* Connection */}
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.connection")}</p>
        <p className="text-sm break-words text-foreground">{t(`direction.${integration.direction}`)}</p>
        <p className="mt-1 text-sm break-words text-neutral-500">
          {t("detail.lastSync")} {formatLastSync(integration.lastSync, t, tAutomations)}
        </p>
      </div>

      {/* Business data */}
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("table.businessData")}</p>
        <p className="text-sm break-words text-neutral-600">
          {integration.dataFlowKeys.map((key) => t(`dataFlow.${key}`)).join(" · ")}
        </p>
      </div>

      {/* Used across AT — plain vertical list, no diagram: the System Landscape strip above the
          table already shows the system → AT → modules architecture once. */}
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.usedAcrossAt")}</p>
        {modules.length === 0 ? (
          <p className="text-sm text-neutral-400">—</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {modules.map((key) => (
              <p key={key} className="text-sm break-words text-foreground">
                {moduleLabel(key)}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Automations using this integration */}
      <div>
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          {t("detail.automationsUsing")}
        </p>
        <p className="text-sm break-words text-foreground">
          {automations.length > 0
            ? automations.map((automation) => tAutomations(`definitions.${automation.key}.name`)).join(" · ")
            : t("detail.noAutomations")}
        </p>
      </div>
    </>
  );
}
