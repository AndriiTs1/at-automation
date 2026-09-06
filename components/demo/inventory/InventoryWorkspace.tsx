"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/dashboard/icons";
import { INVENTORY_ROWS, INVENTORY_SUMMARY } from "@/lib/demo-data";
import InventoryDesktop from "./InventoryDesktop";
import InventoryDetailMobile from "./InventoryDetailMobile";
import InventoryMobileList from "./InventoryMobileList";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import {
  buildInventoryFilterOptions,
  type LocationFilterValue,
  type OpenFilter,
  type StatusFilterValue,
} from "./InventoryToolbar";

const SUMMARY_ITEMS = [
  { key: "totalItems", value: INVENTORY_SUMMARY.totalItems, tone: "accent" },
  { key: "lowStock", value: INVENTORY_SUMMARY.lowStock, tone: "error" },
  { key: "reservedUnits", value: INVENTORY_SUMMARY.reservedUnits, tone: "accent" },
  { key: "inventoryValue", value: INVENTORY_SUMMARY.inventoryValue, tone: "success" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/** Compact 2x2 KPI grid shared by the mobile and tablet Inventory sections — same 4 static
 * page-level figures as desktop's summary row, never recomputed from the active filters. */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Inventory");
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2">
      {SUMMARY_ITEMS.map((item) => (
        <div key={item.key} className="rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
          <p className="text-xs leading-tight text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className={`mt-1 text-lg font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Top-level Inventory workspace — owns all filter/selection state and derives filteredItems
 * once, then fans it out to three breakpoint-gated presentations (mobile / tablet / desktop),
 * mirroring CustomersWorkspace's container-query gating (Stage 2D.4). INVENTORY_ROWS stays
 * the single, unfiltered source of truth; no separate filtered dataset, no viewport-specific
 * business logic.
 */
export default function InventoryWorkspace() {
  const t = useTranslations("Dashboard.Inventory");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [locationFilter, setLocationFilter] = useState<LocationFilterValue>("all");
  // Which Status/Location dropdown (if any) is open — owned here rather than inside a toolbar so
  // the Escape handler below can tell a dropdown is open and let its own Escape close it first,
  // instead of closing the Inventory Detail overlay in the same keypress.
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
      // keypress. Skip closing the detail overlay so the two layers close one at a time:
      // dropdown first, detail on the next Escape.
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
  const { statusOptions, locationOptions } = buildInventoryFilterOptions(t);

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <p className="text-base font-semibold text-foreground">{t("title")}</p>
        <SummaryGrid />

        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              aria-label={t("toolbar.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CustomerFilterDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
              ariaLabel={t("toolbar.allStock")}
              open={openFilter === "status"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
            />
            <CustomerFilterDropdown
              value={locationFilter}
              options={locationOptions}
              onChange={setLocationFilter}
              ariaLabel={t("toolbar.allLocations")}
              open={openFilter === "location"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "location" : null)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredItems.length })}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
              >
                {t("toolbar.clearFilters")}
              </button>
            </div>
          )}
        </div>

        <InventoryMobileList
          rows={filteredItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedItem && <InventoryDetailMobile item={selectedItem} onClose={() => setSelectedId(null)} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {t("newItem")}
          </button>
        </div>

        <SummaryGrid />

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex min-w-[160px] flex-1 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              aria-label={t("toolbar.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <CustomerFilterDropdown
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
            ariaLabel={t("toolbar.allStock")}
            open={openFilter === "status"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
          />
          <CustomerFilterDropdown
            value={locationFilter}
            options={locationOptions}
            onChange={setLocationFilter}
            ariaLabel={t("toolbar.allLocations")}
            open={openFilter === "location"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "location" : null)}
          />

          {hasActiveFilters && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredItems.length })}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
              >
                {t("toolbar.clearFilters")}
              </button>
            </div>
          )}
        </div>

        <InventoryMobileList
          rows={filteredItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedItem && <InventoryDetailMobile item={selectedItem} onClose={() => setSelectedId(null)} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2D.3 */}
      <InventoryDesktop
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={setOpenFilter}
        filteredItems={filteredItems}
        selectedId={selectedId}
        onSelectRow={setSelectedId}
        selectedItem={selectedItem}
        onCloseDetail={() => setSelectedId(null)}
      />
    </>
  );
}
