import type { CustomerRow } from "@/lib/demo-data";
import CustomerDetailContent from "./CustomerDetailContent";

/**
 * Full-screen Customer Detail overlay for tablet and mobile (Stage 2C.4) — mirrors
 * OperationDetailMobile exactly. z-[60] matches the established full-screen-overlay tier
 * (above the tablet nav backdrop and header/nav-drawer). Uses CustomerDetailContent's
 * "mobile" variant for a more generously spaced full-screen layout — the desktop drawer
 * (CustomerDetailPanel) keeps the default "desktop" variant untouched.
 */
export default function CustomerDetailMobile({
  customer,
  onClose,
}: {
  customer: CustomerRow;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <CustomerDetailContent customer={customer} onClose={onClose} variant="mobile" />
    </div>
  );
}
