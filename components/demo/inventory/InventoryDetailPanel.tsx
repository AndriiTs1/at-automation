import type { InventoryItem } from "@/lib/demo-data";
import InventoryDetailContent from "./InventoryDetailContent";

/**
 * Desktop-only right-side overlay drawer — mirrors CustomerDetailPanel's proven architecture
 * exactly (absolutely positioned against InventoryWorkspace's `relative` wrapper rather than
 * participating in flex layout, so the Inventory table underneath never resizes or drops
 * columns when an item is selected).
 */
export default function InventoryDetailPanel({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[-4px_0_16px_-8px_rgba(0,0,0,0.1)]">
      <InventoryDetailContent item={item} onClose={onClose} />
    </div>
  );
}
