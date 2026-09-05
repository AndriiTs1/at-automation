import type { OperationRow } from "@/lib/demo-data";
import OperationDetailContent from "./OperationDetailContent";

/** Desktop-only 400px side panel. Visual output unchanged from Stage 2B.2/2B.3. */
export default function OperationDetailPanel({
  operation,
  onClose,
}: {
  operation: OperationRow;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full w-[400px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      <OperationDetailContent operation={operation} onClose={onClose} />
    </div>
  );
}
