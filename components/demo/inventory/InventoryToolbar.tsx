import { useTranslations } from "next-intl";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import { SearchIcon } from "@/components/dashboard/icons";
import { INVENTORY_LOCATIONS, INVENTORY_STATUSES, type InventoryStatus } from "@/lib/demo-data";

export type StatusFilterValue = InventoryStatus | "all";
export type LocationFilterValue = string;

export type OpenFilter = "status" | "location" | null;

/**
 * Segment/Health-style option lists for Inventory's Status/Location dropdowns — built once here
 * so the "all" + translated-option construction lives in one place. Location labels are the raw
 * stored identifiers (never translated, per Stage 2D.3 spec), unlike status which resolves
 * through the already-existing Dashboard.Inventory.status.* keys.
 */
export function buildInventoryFilterOptions(t: ReturnType<typeof useTranslations>) {
  return {
    statusOptions: [
      { value: "all" as const, label: t("toolbar.allStock") },
      ...INVENTORY_STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) })),
    ],
    locationOptions: [
      { value: "all", label: t("toolbar.allLocations") },
      ...INVENTORY_LOCATIONS.map((location) => ({ value: location, label: location })),
    ],
  };
}

/**
 * Functional Inventory toolbar (Stage 2D.3) — same visual composition as the Stage 2D.1 static
 * toolbar, now wired to filter state owned by InventoryWorkspace. Reuses CustomerFilterDropdown
 * directly (rather than a copy-pasted second implementation) since its API is already fully
 * generic — no Customer-specific semantics — so Inventory can depend on it without any change
 * to the Customers module.
 *
 * `openFilter` is owned by InventoryWorkspace rather than locally — its Escape handler needs to
 * know a dropdown is open so it can let the dropdown's own Escape close first, instead of
 * closing the Inventory Detail drawer in the same keypress (mirrors Customers exactly).
 */
export default function InventoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  resultCount,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (value: StatusFilterValue) => void;
  locationFilter: LocationFilterValue;
  onLocationChange: (value: LocationFilterValue) => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
}) {
  const t = useTranslations("Dashboard.Inventory");
  const { statusOptions, locationOptions } = buildInventoryFilterOptions(t);

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2">
      <div className="flex w-64 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
        <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          aria-label={t("toolbar.searchPlaceholder")}
          className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      <CustomerFilterDropdown
        value={statusFilter}
        options={statusOptions}
        onChange={onStatusChange}
        ariaLabel={t("toolbar.allStock")}
        open={openFilter === "status"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "status" : null)}
      />

      <CustomerFilterDropdown
        value={locationFilter}
        options={locationOptions}
        onChange={onLocationChange}
        ariaLabel={t("toolbar.allLocations")}
        open={openFilter === "location"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "location" : null)}
      />

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <span className="text-xs text-neutral-400">{t("toolbar.resultCount", { count: resultCount })}</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
          >
            {t("toolbar.clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}
