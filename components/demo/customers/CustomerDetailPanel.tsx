import type { CustomerRow } from "@/lib/demo-data";
import CustomerDetailContent from "./CustomerDetailContent";

/** Desktop-only 420px side panel — same visual language as Operation Detail, distinct width. */
export default function CustomerDetailPanel({
  customer,
  onClose,
}: {
  customer: CustomerRow;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full w-[420px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      <CustomerDetailContent customer={customer} onClose={onClose} />
    </div>
  );
}
