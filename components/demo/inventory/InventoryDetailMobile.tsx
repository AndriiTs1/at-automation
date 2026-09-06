import type { InventoryItem } from "@/lib/demo-data";
import InventoryDetailContent from "./InventoryDetailContent";

/**
 * Full-screen Inventory Detail overlay for tablet and mobile (Stage 2D.4) — mirrors
 * CustomerDetailMobile/OperationDetailMobile exactly. z-[60] matches the established
 * full-screen-overlay tier (above the tablet nav backdrop and header/nav-drawer).
 */
export default function InventoryDetailMobile({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <InventoryDetailContent item={item} onClose={onClose} />
    </div>
  );
}
