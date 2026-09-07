import type { IntegrationDefinition } from "@/lib/demo-data";
import IntegrationDetailContent from "./IntegrationDetailContent";

/**
 * Full-screen Integration Detail overlay for tablet and mobile (Stage 2G.3) — mirrors
 * AutomationDetailMobile/InventoryDetailMobile exactly. z-[60] matches the established
 * full-screen-overlay tier (above the tablet nav backdrop and header/nav-drawer). Renders the
 * exact same IntegrationDetailContent as the desktop 420px drawer — no duplicated detail JSX, no
 * separate mobile business logic, no mobile-specific alternative facts.
 */
export default function IntegrationDetailMobile({
  integration,
  onClose,
}: {
  integration: IntegrationDefinition;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <IntegrationDetailContent integration={integration} onClose={onClose} />
    </div>
  );
}
