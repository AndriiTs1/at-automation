"use client";

import { useEffect, useState } from "react";
import { INVENTORY_ROWS } from "@/lib/demo-data";
import InventoryDetailPanel from "./InventoryDetailPanel";
import InventoryTable from "./InventoryTable";

/**
 * Smallest clean client boundary for Inventory row selection (Stage 2D.2) — header, KPIs and
 * the static toolbar stay server-rendered in InventoryDesktop; only selection state and its
 * Escape-to-close behavior need the client. No dropdown menus exist yet in Inventory (that's
 * Stage 2D.3), so unlike Customers' workspace this Escape handler doesn't need to check for an
 * open filter before closing the drawer — a single flat "Escape closes the drawer" rule is
 * correct here.
 */
export default function InventoryWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedItem = INVENTORY_ROWS.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="relative flex min-h-0 flex-1">
      <InventoryTable rows={INVENTORY_ROWS} selectedId={selectedId} onSelect={setSelectedId} />
      {selectedItem && (
        <>
          {/* Subtle workspace-level scrim — communicates layering without darkening the app or
              blocking recognition of the table underneath. Decorative: X and Escape are the
              primary close mechanisms, so this stays out of tab order and hidden from AT. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-10 cursor-default bg-black/[0.02]"
          />
          <InventoryDetailPanel item={selectedItem} onClose={() => setSelectedId(null)} />
        </>
      )}
    </div>
  );
}
