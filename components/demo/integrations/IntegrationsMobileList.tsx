"use client";

import { useTranslations } from "next-intl";
import { INTEGRATION_DEFINITIONS, type IntegrationDefinition } from "@/lib/demo-data";
import { formatLastSync, systemDisplayName } from "./integrationFormatters";

const STATUS_TONE: Record<string, string> = {
  connected: "bg-success/10 text-success",
  demo: "bg-accent/10 text-accent",
  ready: "bg-neutral-200 text-neutral-600",
  notConnected: "bg-neutral-100 text-neutral-400",
};

/**
 * Dense stacked integration list for tablet and mobile (Stage 2G.3) — mirrors
 * AutomationsMobileList's pattern exactly: one reusable presentation shared by both breakpoints;
 * only the surrounding header/summary/landscape markup differs per breakpoint (see
 * IntegrationsWorkspace). The desktop table (IntegrationsDesktop) is untouched and not reused
 * here. INTEGRATION_DEFINITIONS is read directly — there is no filtering in this stage, so no
 * separate filtered dataset exists.
 *
 * Deliberately omits "Used by AT modules"/"Used by automations" — that deeper relationship
 * belongs in the detail (IntegrationDetailContent already shows it), not in every list row, per
 * the stage's own density guidance. Last activity only renders where the desktop detail would
 * also show it (connected/demo with a real lastSync) — never fabricated for ready/notConnected.
 */
export default function IntegrationsMobileList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");

  return (
    <ul className="flex flex-col gap-2">
      {INTEGRATION_DEFINITIONS.map((integration: IntegrationDefinition) => {
        const isSelected = integration.id === selectedId;
        const showLastActivity = (integration.status === "connected" || integration.status === "demo") && integration.lastSync;
        return (
          <li key={integration.id}>
            <button
              type="button"
              onClick={() => onSelect(integration.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 text-sm font-semibold break-words text-foreground">
                  {systemDisplayName(integration, t)}
                </p>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium break-words ${STATUS_TONE[integration.status]}`}
                >
                  {t(`status.${integration.status}`)}
                </span>
              </div>

              <p className="text-xs break-words text-neutral-500">
                {t(`category.${integration.category}`)} · {t(`direction.${integration.direction}`)}
              </p>

              <p className="text-xs break-words text-neutral-600">
                {integration.dataFlowKeys.map((key) => t(`dataFlow.${key}`)).join(" · ")}
              </p>

              {showLastActivity && (
                <p className="text-xs text-neutral-400">{formatLastSync(integration.lastSync, t, tAutomations)}</p>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
