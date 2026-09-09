import { useTranslations } from "next-intl";
import { SearchIcon } from "@/components/dashboard/icons";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import { OPERATIONS_SUMMARY, OPERATION_OWNERS, type OperationRow, type OperationStatus } from "@/lib/demo-data";
import OperationDetailPanel from "./OperationDetailPanel";
import OperationsTable from "./OperationsTable";

const SUMMARY_ITEMS = [
  { key: "active", value: OPERATIONS_SUMMARY.active, tone: "accent" },
  { key: "needsAttention", value: OPERATIONS_SUMMARY.needsAttention, tone: "error" },
  { key: "completedToday", value: OPERATIONS_SUMMARY.completedToday, tone: "success" },
  { key: "totalValue", value: OPERATIONS_SUMMARY.totalValue, tone: "accent" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

const STATUS_OPTIONS: OperationStatus[] = ["inProgress", "waiting", "attention", "completed"];

export type StatusFilterValue = OperationStatus | "all";
export type OpenFilter = "status" | "owner" | null;

/**
 * Status/Owner dropdown option lists — mirrors CustomersToolbar's buildCustomerFilterOptions
 * (the "all" + translated-option construction lives in one place). Operations has no separate
 * Toolbar file, so this lives alongside the desktop markup that's currently its only consumer.
 */
function buildOperationsFilterOptions(t: ReturnType<typeof useTranslations>) {
  return {
    statusOptions: [
      { value: "all" as const, label: t("toolbar.allStatuses") },
      ...STATUS_OPTIONS.map((status) => ({ value: status, label: t(`status.${status}`) })),
    ],
    ownerOptions: [
      { value: "all", label: t("toolbar.allOwners") },
      ...OPERATION_OWNERS.map((owner) => ({ value: owner, label: owner })),
    ],
  };
}

/**
 * Desktop-only Operations workspace. Hidden below the @5xl container-query breakpoint —
 * visual output unchanged since Stage 2B.3; now a presentational component receiving the
 * shared filter/selection state from OperationsWorkspace instead of owning it itself.
 */
export default function OperationsDesktop({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ownerFilter,
  onOwnerChange,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
  filteredOperations,
  selectedId,
  onSelectRow,
  selectedOperation,
  onCloseDetail,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (value: StatusFilterValue) => void;
  ownerFilter: string;
  onOwnerChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  /** Which Status/Owner dropdown (if any) is open — owned by OperationsWorkspace, mirroring
   * CustomersWorkspace's identical pattern. */
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
  filteredOperations: OperationRow[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedOperation: OperationRow | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Operations");
  const { statusOptions, ownerOptions } = buildOperationsFilterOptions(t);

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
          {t("newOperation")}
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

      {/* Toolbar */}
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
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusChange}
          ariaLabel={t("toolbar.allStatuses")}
          open={openFilter === "status"}
          onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "status" : null)}
        />

        <CustomerFilterDropdown
          value={ownerFilter}
          options={ownerOptions}
          onChange={onOwnerChange}
          ariaLabel={t("toolbar.allOwners")}
          open={openFilter === "owner"}
          onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "owner" : null)}
        />

        {hasActiveFilters && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="text-xs text-neutral-400">{t("toolbar.resultCount", { count: filteredOperations.length })}</span>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
            >
              {t("toolbar.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Table + detail panel */}
      <div className="flex min-h-0 flex-1 gap-3">
        <OperationsTable
          rows={filteredOperations}
          selectedId={selectedId}
          onSelect={onSelectRow}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        {selectedOperation && <OperationDetailPanel operation={selectedOperation} onClose={onCloseDetail} />}
      </div>
    </div>
  );
}
