import { useTranslations } from "next-intl";
import { CUSTOMERS_SUMMARY, type CustomerRow } from "@/lib/demo-data";
import CustomerDetailPanel from "./CustomerDetailPanel";
import CustomersTable from "./CustomersTable";
import CustomersToolbar, { type HealthFilterValue, type OpenFilter, type SegmentFilterValue } from "./CustomersToolbar";

const SUMMARY_ITEMS = [
  { key: "totalCustomers", value: CUSTOMERS_SUMMARY.totalCustomers, tone: "accent" },
  { key: "activeAccounts", value: CUSTOMERS_SUMMARY.activeAccounts, tone: "success" },
  { key: "needsAttention", value: CUSTOMERS_SUMMARY.needsAttention, tone: "error" },
  { key: "outstanding", value: CUSTOMERS_SUMMARY.outstanding, tone: "accent" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/**
 * Desktop-only Customers workspace. Hidden below the @5xl container-query breakpoint — visual
 * output unchanged since the column-alignment polish stage; now a presentational component
 * receiving the shared filter/selection state from CustomersWorkspace instead of owning it
 * itself (Stage 2C.4), mirroring OperationsDesktop's prop-driven pattern.
 */
export default function CustomersDesktop({
  searchQuery,
  onSearchChange,
  segmentFilter,
  onSegmentChange,
  healthFilter,
  onHealthChange,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
  filteredCustomers,
  selectedId,
  onSelectRow,
  selectedCustomer,
  onCloseDetail,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  segmentFilter: SegmentFilterValue;
  onSegmentChange: (value: SegmentFilterValue) => void;
  healthFilter: HealthFilterValue;
  onHealthChange: (value: HealthFilterValue) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
  filteredCustomers: CustomerRow[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedCustomer: CustomerRow | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Customers");

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
          {t("newCustomer")}
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

      <CustomersToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        segmentFilter={segmentFilter}
        onSegmentChange={onSegmentChange}
        healthFilter={healthFilter}
        onHealthChange={onHealthChange}
        resultCount={filteredCustomers.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={onOpenFilterChange}
      />
      <div className="relative flex min-h-0 flex-1">
        <CustomersTable
          rows={filteredCustomers}
          selectedId={selectedId}
          onSelect={onSelectRow}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        {selectedCustomer && (
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
            <CustomerDetailPanel customer={selectedCustomer} onClose={onCloseDetail} />
          </>
        )}
      </div>
    </div>
  );
}
