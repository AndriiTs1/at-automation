import type { FinanceInvoice } from "@/lib/demo-data";
import FinanceDetailContent from "./FinanceDetailContent";

/**
 * Full-screen Finance Detail overlay for tablet and mobile (Stage 2E.4) — mirrors
 * InventoryDetailMobile/CustomerDetailMobile exactly. z-[60] matches the established
 * full-screen-overlay tier (above the tablet nav backdrop and header/nav-drawer). Reuses
 * FinanceDetailContent directly (the same body the desktop 420px drawer renders), so responsive
 * Detail can never drift from the approved Amounts/Payment status/Connected operation/Payment
 * activity/Draft-safety logic.
 */
export default function FinanceDetailMobile({
  invoice,
  onClose,
}: {
  invoice: FinanceInvoice;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <FinanceDetailContent invoice={invoice} onClose={onClose} />
    </div>
  );
}
