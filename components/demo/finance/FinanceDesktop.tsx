import { useTranslations } from "next-intl";
import {
  getOpenInvoiceCount,
  getOverdueOutstanding,
  getTotalOutstanding,
  getTotalPaid,
  type FinanceInvoice,
} from "@/lib/demo-data";
import FinanceCashFlowSummary from "./FinanceCashFlowSummary";
import FinanceDetailPanel from "./FinanceDetailPanel";
import FinanceTable from "./FinanceTable";
import FinanceToolbar, {
  type CustomerFilterValue,
  type OpenFilter,
  type ReconciliationFilterValue,
  type StatusFilterValue,
} from "./FinanceToolbar";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/**
 * Desktop-only Finance workspace (Stage 2E.3). Hidden below the @5xl container-query breakpoint,
 * matching CustomersDesktop/InventoryDesktop/OperationsDesktop's own threshold. Header and KPIs
 * are unchanged since Stage 2E.1 and deliberately computed from the global getTotalOutstanding/
 * getOverdueOutstanding/getOpenInvoiceCount/getTotalPaid helpers (i.e. from ALL of
 * FINANCE_INVOICES) rather than from filteredInvoices — the KPI row is a page-level metric, not
 * a filtered total, and must stay CHF 86,400/24,500/9/28,200 regardless of the active filters.
 * A presentational component receiving the shared filter/selection state from FinanceWorkspace,
 * mirroring InventoryDesktop's prop-driven pattern.
 */
export default function FinanceDesktop({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  customerFilter,
  onCustomerChange,
  reconciliationFilter,
  onReconciliationChange,
  hasActiveFilters,
  onClearFilters,
  openFilter,
  onOpenFilterChange,
  filteredInvoices,
  selectedId,
  onSelectRow,
  selectedInvoice,
  onCloseDetail,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (value: StatusFilterValue) => void;
  customerFilter: CustomerFilterValue;
  onCustomerChange: (value: CustomerFilterValue) => void;
  reconciliationFilter: ReconciliationFilterValue;
  onReconciliationChange: (value: ReconciliationFilterValue) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  openFilter: OpenFilter;
  onOpenFilterChange: (value: OpenFilter) => void;
  filteredInvoices: FinanceInvoice[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  selectedInvoice: FinanceInvoice | null;
  onCloseDetail: () => void;
}) {
  const t = useTranslations("Dashboard.Finance");

  const summaryItems = [
    { key: "outstanding", value: formatChf(getTotalOutstanding()), tone: "accent" },
    { key: "overdue", value: formatChf(getOverdueOutstanding()), tone: "error" },
    { key: "openInvoices", value: String(getOpenInvoiceCount()), tone: "accent" },
    { key: "paid", value: formatChf(getTotalPaid()), tone: "success" },
  ] as const;

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
          {t("newInvoice")}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <FinanceCashFlowSummary />

      <FinanceToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        customerFilter={customerFilter}
        onCustomerChange={onCustomerChange}
        reconciliationFilter={reconciliationFilter}
        onReconciliationChange={onReconciliationChange}
        resultCount={filteredInvoices.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={onOpenFilterChange}
      />

      {/* Table */}
      <div className="relative flex min-h-0 flex-1">
        <FinanceTable
          rows={filteredInvoices}
          selectedId={selectedId}
          onSelect={onSelectRow}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        {selectedInvoice && (
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
            <FinanceDetailPanel invoice={selectedInvoice} onClose={onCloseDetail} />
          </>
        )}
      </div>
    </div>
  );
}
