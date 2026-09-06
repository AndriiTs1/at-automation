import { useTranslations } from "next-intl";
import { INVENTORY_SUMMARY, type InventoryItem } from "@/lib/demo-data";
import InventoryDetailPanel from "./InventoryDetailPanel";
import InventoryTable from "./InventoryTable";
import InventoryToolbar, { type LocationFilterValue, type OpenFilter, type StatusFilterValue } from "./InventoryToolbar";

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

/**
 * Desktop-only Inventory workspace. Hidden below the @5xl container-query breakpoint, matching
 * CustomersDesktop/OperationsDesktop's own threshold. Visual output unchanged since Stage
 * 2D.3; now a presentational component receiving the shared filter/selection state from
 * InventoryWorkspace instead of owning it itself (Stage 2D.4), mirroring CustomersDesktop's
 * prop-driven pattern.
 */
export default function InventoryDesktop({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
  filteredItems,
  selectedId,
  onSelectRow,
  selectedItem,
  onCloseDetail,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (value: StatusFilterValue) => void;
  locationFilter: LocationFilterValue;
  onLocationChange: (value: LocationFilterValue) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
  filteredItems: InventoryItem[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedItem: InventoryItem | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Inventory");

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header */}
      <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          {t("newItem")}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <InventoryToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        locationFilter={locationFilter}
        onLocationChange={onLocationChange}
        resultCount={filteredItems.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={onOpenFilterChange}
      />
      <div className="relative flex min-h-0 flex-1">
        <InventoryTable
          rows={filteredItems}
          selectedId={selectedId}
          onSelect={onSelectRow}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
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
              onClick={onCloseDetail}
              className="absolute inset-0 z-10 cursor-default bg-black/[0.02]"
            />
            <InventoryDetailPanel item={selectedItem} onClose={onCloseDetail} />
          </>
        )}
      </div>
    </div>
  );
}
