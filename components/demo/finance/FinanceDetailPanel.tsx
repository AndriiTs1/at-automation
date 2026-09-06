import type { FinanceInvoice } from "@/lib/demo-data";
import FinanceDetailContent from "./FinanceDetailContent";

/**
 * Desktop-only right-side overlay drawer — mirrors CustomerDetailPanel/InventoryDetailPanel's
 * proven architecture exactly (absolutely positioned against FinanceWorkspace's `relative`
 * wrapper rather than participating in flex layout, so the Finance table underneath never
 * resizes or drops columns when an invoice is selected).
 */
export default function FinanceDetailPanel({
  invoice,
  onClose,
}: {
  invoice: FinanceInvoice;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[-4px_0_16px_-8px_rgba(0,0,0,0.1)]">
      <FinanceDetailContent invoice={invoice} onClose={onClose} />
    </div>
  );
}
