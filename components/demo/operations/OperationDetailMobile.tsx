import type { OperationRow } from "@/lib/demo-data";
import OperationDetailContent from "./OperationDetailContent";

/**
 * Tablet/mobile detail experience: a full-viewport overlay layer instead of the desktop
 * 400px side panel, so the operations list is never squeezed into an unusably narrow column.
 * Shares OperationDetailContent with the desktop panel — same information, same close control.
 */
export default function OperationDetailMobile({
  operation,
  onClose,
}: {
  operation: OperationRow;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <OperationDetailContent operation={operation} onClose={onClose} />
    </div>
  );
}
