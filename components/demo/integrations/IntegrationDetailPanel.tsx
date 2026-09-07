import type { IntegrationDefinition } from "@/lib/demo-data";
import IntegrationDetailContent from "./IntegrationDetailContent";

/**
 * Desktop-only right-side overlay drawer (Stage 2G.2) — mirrors AutomationDetailPanel/
 * InventoryDetailPanel's proven architecture exactly: absolutely positioned against
 * IntegrationsDesktop's `relative` wrapper rather than participating in flex layout, so the
 * integration table (and the system landscape strip above it) never resize when a row is
 * selected.
 */
export default function IntegrationDetailPanel({
  integration,
  onClose,
}: {
  integration: IntegrationDefinition;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[-4px_0_16px_-8px_rgba(0,0,0,0.1)]">
      <IntegrationDetailContent integration={integration} onClose={onClose} />
    </div>
  );
}
