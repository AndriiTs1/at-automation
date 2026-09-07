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
