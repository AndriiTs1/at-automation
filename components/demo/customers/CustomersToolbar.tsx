import { useTranslations } from "next-intl";
import { SearchIcon } from "@/components/dashboard/icons";
import { CUSTOMER_HEALTH_OPTIONS, CUSTOMER_SEGMENTS, type CustomerHealth, type CustomerSegment } from "@/lib/demo-data";
import CustomerFilterDropdown from "./CustomerFilterDropdown";

export type SegmentFilterValue = CustomerSegment | "all";
export type HealthFilterValue = CustomerHealth | "all";

export type OpenFilter = "segment" | "health" | null;

/**
 * Segment/Health dropdown option lists — shared by the desktop toolbar below and the
 * tablet/mobile toolbars in CustomersWorkspace, so the "all" + translated-option construction
 * lives in exactly one place regardless of which breakpoint's markup renders the dropdowns.
 */
export function buildCustomerFilterOptions(t: ReturnType<typeof useTranslations>) {
  return {
    segmentOptions: [
      { value: "all" as const, label: t("toolbar.allSegments") },
      ...CUSTOMER_SEGMENTS.map((segment) => ({ value: segment, label: t(`segment.${segment}`) })),
    ],
    healthOptions: [
      { value: "all" as const, label: t("toolbar.allHealth") },
      ...CUSTOMER_HEALTH_OPTIONS.map((health) => ({ value: health, label: t(`health.${health}`) })),
    ],
  };
}

/**
 * Functional Customers toolbar (Stage 2C.3) — same visual composition as the Stage 2C.1/2C.2
 * static toolbar, now wired to filter state owned by CustomersWorkspace. Reuses Operations'
 * proven search/select/result-count/clear-filters interaction pattern.
 *
 * `openFilter` (which dropdown, if any, is open) is owned by CustomersWorkspace rather than
 * locally — its Escape handler needs to know a dropdown is open so it can let the dropdown's
 * own Escape close first, instead of closing the Customer Detail drawer in the same keypress.
 */
export default function CustomersToolbar({
  searchQuery,
  onSearchChange,
  segmentFilter,
  onSegmentChange,
  healthFilter,
  onHealthChange,
  resultCount,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  segmentFilter: SegmentFilterValue;
  onSegmentChange: (value: SegmentFilterValue) => void;
  healthFilter: HealthFilterValue;
  onHealthChange: (value: HealthFilterValue) => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
}) {
  const t = useTranslations("Dashboard.Customers");
  const { segmentOptions, healthOptions } = buildCustomerFilterOptions(t);

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2">
      <div className="flex w-64 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
        <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      <CustomerFilterDropdown
        value={segmentFilter}
        options={segmentOptions}
        onChange={onSegmentChange}
        ariaLabel={t("toolbar.allSegments")}
        open={openFilter === "segment"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "segment" : null)}
      />

      <CustomerFilterDropdown
        value={healthFilter}
        options={healthOptions}
        onChange={onHealthChange}
        ariaLabel={t("toolbar.allHealth")}
        open={openFilter === "health"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "health" : null)}
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
