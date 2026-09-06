import type { CustomerRow } from "@/lib/demo-data";
import CustomerDetailContent from "./CustomerDetailContent";

/**
 * Desktop-only 420px right-side overlay drawer. Absolutely positioned against
 * CustomersWorkspace's `relative` wrapper rather than participating in flex layout, so the
 * Customers table underneath keeps its exact normal-state column geometry — it never resizes
 * or drops columns when a customer is selected. Separation from the table comes from the
 * drawer's own border + a tight, restrained left-edge shadow rather than a heavy backdrop —
 * the drawer should read as attached to the workspace, not floating above it.
 */
export default function CustomerDetailPanel({
  customer,
  onClose,
}: {
  customer: CustomerRow;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[-4px_0_16px_-8px_rgba(0,0,0,0.1)]">
      <CustomerDetailContent customer={customer} onClose={onClose} />
    </div>
  );
}
