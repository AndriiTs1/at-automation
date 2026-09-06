"use client";

import { useEffect, useMemo, useState } from "react";
import { INVENTORY_ROWS } from "@/lib/demo-data";
import InventoryDetailPanel from "./InventoryDetailPanel";
import InventoryTable from "./InventoryTable";
import InventoryToolbar, {
  type LocationFilterValue,
  type OpenFilter,
  type StatusFilterValue,
} from "./InventoryToolbar";

/**
 * Client boundary for Inventory row selection and filtering (Stage 2D.3) — header/KPIs stay
 * server-rendered in InventoryDesktop; this owns selectedInventoryItemId, searchQuery,
 * statusFilter, locationFilter and openFilter (mirrors CustomersWorkspace exactly).
 * filteredItems is derived directly from INVENTORY_ROWS on every render — no separate filtered
 * dataset, no mutation, no duplication.
 */
export default function InventoryWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [locationFilter, setLocationFilter] = useState<LocationFilterValue>("all");
  // Which Status/Location dropdown (if any) is open — owned here rather than inside
  // InventoryToolbar so the Escape handler below can tell a dropdown is open and let its own
  // Escape close it first, instead of closing the Inventory Detail drawer in the same keypress.
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return INVENTORY_ROWS.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (locationFilter !== "all" && item.location !== locationFilter) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, statusFilter, locationFilter]);

  // Reset selection when the active filters change and the previously-selected row is no
  // longer among the results — computed during render, per React's guidance for adjusting
  // state from a changing input rather than via an Effect (mirrors CustomersWorkspace).
  const filterKey = `${searchQuery}|${statusFilter}|${locationFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedId && !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(null);
    }
  }

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A dropdown owns this Escape if one is open — its own handler closes it on this same
      // keypress. Skip closing the drawer so the two layers close one at a time: dropdown
      // first, drawer on the next Escape.
      if (openFilter) return;
      setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, openFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || locationFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? null;

  return (
    <>
      <InventoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        resultCount={filteredItems.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={setOpenFilter}
      />
      <div className="relative flex min-h-0 flex-1">
        <InventoryTable
          rows={filteredItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
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
    </>
  );
}
