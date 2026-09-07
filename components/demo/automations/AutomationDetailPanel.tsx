import type { AutomationDefinition } from "@/lib/demo-data";
import AutomationDetailContent from "./AutomationDetailContent";

/**
 * Desktop-only right-side overlay drawer (Stage 2F.2) — mirrors InventoryDetailPanel/
 * CustomerDetailPanel's proven architecture exactly: absolutely positioned against
 * AutomationsDesktop's `relative` wrapper rather than participating in flex layout, so the
 * automation table (and the Recent Activity aside) underneath never resize when a row is
 * selected.
 */
export default function AutomationDetailPanel({
  automation,
  onClose,
}: {
  automation: AutomationDefinition;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[-4px_0_16px_-8px_rgba(0,0,0,0.1)]">
      <AutomationDetailContent automation={automation} onClose={onClose} />
    </div>
  );
}
