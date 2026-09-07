import type { AutomationDefinition } from "@/lib/demo-data";
import AutomationDetailContent from "./AutomationDetailContent";

/**
 * Full-screen Automation Detail overlay for tablet and mobile (Stage 2F.4) — mirrors
 * InventoryDetailMobile/CustomerDetailMobile/OperationDetailMobile exactly. z-[60] matches the
 * established full-screen-overlay tier (above the tablet nav backdrop and header/nav-drawer).
 * Renders the exact same AutomationDetailContent as the desktop 420px drawer — no duplicated
 * detail JSX, no separate mobile business logic.
 */
export default function AutomationDetailMobile({
  automation,
  onClose,
}: {
  automation: AutomationDefinition;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <AutomationDetailContent automation={automation} onClose={onClose} />
    </div>
  );
}
