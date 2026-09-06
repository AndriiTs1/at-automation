import { useTranslations } from "next-intl";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import { SearchIcon } from "@/components/dashboard/icons";
import {
  FINANCE_INVOICE_CUSTOMER_IDS,
  FINANCE_INVOICE_STATUSES,
  FINANCE_RECONCILIATION_STATES,
  getFinanceCustomer,
  type FinanceInvoiceStatus,
  type FinanceReconciliationState,
} from "@/lib/demo-data";

export type StatusFilterValue = FinanceInvoiceStatus | "all";
export type CustomerFilterValue = string;
export type ReconciliationFilterValue = FinanceReconciliationState | "all";

export type OpenFilter = "status" | "customer" | "reconciliation" | null;

/**
 * Status/Customer/Reconciliation option lists for Finance's dropdowns — built once here so the
 * "all" + translated-option construction lives in one place, mirroring
 * InventoryToolbar's buildInventoryFilterOptions exactly. Customer options are derived from
 * FINANCE_INVOICE_CUSTOMER_IDS (never a hardcoded second customer list) and resolved to display
 * names live via getFinanceCustomer; status/reconciliation reuse the already-existing
 * Dashboard.Finance status and detail.reconciliationState keys rather than duplicating labels.
 */
export function buildFinanceFilterOptions(t: ReturnType<typeof useTranslations>) {
  return {
    statusOptions: [
      { value: "all" as const, label: t("toolbar.allStatuses") },
      ...FINANCE_INVOICE_STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) })),
    ],
    customerOptions: [
      { value: "all", label: t("toolbar.allCustomers") },
      ...FINANCE_INVOICE_CUSTOMER_IDS.map((customerId) => ({
        value: customerId,
        label: getFinanceCustomer(customerId)?.name ?? customerId,
      })),
    ],
    reconciliationOptions: [
      { value: "all" as const, label: t("toolbar.allReconciliation") },
      ...FINANCE_RECONCILIATION_STATES.map((state) => ({
        value: state,
        label: t(`detail.reconciliationState.${state}`),
      })),
    ],
  };
}

/**
 * Functional Finance toolbar (Stage 2E.3) — same visual composition as Inventory/Customers'
 * toolbars, reusing CustomerFilterDropdown directly (its API is already fully generic, no
 * Customer-specific semantics, so no change to the Customers module is needed). `openFilter` is
 * owned by FinanceWorkspace rather than locally — its Escape handler needs to know a dropdown is
 * open so it can let the dropdown's own Escape close first, instead of closing the Finance
 * Detail drawer in the same keypress (mirrors Customers/Inventory exactly).
 *
 * flex-wrap lets the three dropdowns + result count drop to a second line at 1280px rather than
 * force everything onto one cramped row — the search box and dropdowns never shrink below their
 * own content needs.
 */
export default function FinanceToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  customerFilter,
  onCustomerChange,
  reconciliationFilter,
  onReconciliationChange,
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
  customerFilter: CustomerFilterValue;
  onCustomerChange: (value: CustomerFilterValue) => void;
  reconciliationFilter: ReconciliationFilterValue;
  onReconciliationChange: (value: ReconciliationFilterValue) => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
}) {
  const t = useTranslations("Dashboard.Finance");
  const { statusOptions, customerOptions, reconciliationOptions } = buildFinanceFilterOptions(t);

  return (
    <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2">
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
        ariaLabel={t("toolbar.allStatuses")}
        open={openFilter === "status"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "status" : null)}
      />

      <CustomerFilterDropdown
        value={customerFilter}
        options={customerOptions}
        onChange={onCustomerChange}
        ariaLabel={t("toolbar.allCustomers")}
        open={openFilter === "customer"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "customer" : null)}
      />

      <CustomerFilterDropdown
        value={reconciliationFilter}
        options={reconciliationOptions}
        onChange={onReconciliationChange}
        ariaLabel={t("toolbar.allReconciliation")}
        open={openFilter === "reconciliation"}
        onOpenChange={(isOpen) => onOpenFilterChange(isOpen ? "reconciliation" : null)}
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
