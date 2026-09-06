"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import { SearchIcon } from "@/components/dashboard/icons";
import {
  FINANCE_INVOICES,
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceReconciliationState,
  getOpenInvoiceCount,
  getOverdueOutstanding,
  getTotalOutstanding,
  getTotalPaid,
} from "@/lib/demo-data";
import FinanceDesktop from "./FinanceDesktop";
import FinanceDetailMobile from "./FinanceDetailMobile";
import FinanceMobileList from "./FinanceMobileList";
import {
  buildFinanceFilterOptions,
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
 * Compact 2x2 KPI grid shared by the mobile and tablet Finance sections — same 4 GLOBAL
 * page-level figures as desktop's summary row (computed from ALL of FINANCE_INVOICES via the
 * existing getTotalOutstanding/getOverdueOutstanding/getOpenInvoiceCount/getTotalPaid helpers),
 * never recomputed from the active filters. Filtering the list must never move these numbers.
 */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Finance");
  const summaryItems = [
    { key: "outstanding", value: formatChf(getTotalOutstanding()), tone: "accent" },
    { key: "overdue", value: formatChf(getOverdueOutstanding()), tone: "error" },
    { key: "openInvoices", value: String(getOpenInvoiceCount()), tone: "accent" },
    { key: "paid", value: formatChf(getTotalPaid()), tone: "success" },
  ] as const;

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2">
      {summaryItems.map((item) => (
        <div key={item.key} className="rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
          <p className="text-xs leading-tight text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className={`mt-1 text-lg font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Top-level Finance workspace — owns all filter/selection state and derives filteredInvoices
 * once, then fans it out to three breakpoint-gated presentations (mobile / tablet / desktop),
 * mirroring InventoryWorkspace's container-query gating (Stage 2D.4) and Finance's own 2E.3
 * filter architecture. FINANCE_INVOICES stays the single, unfiltered source of truth; no separate
 * filtered dataset, no viewport-specific business logic, no duplicated selection state.
 */
export default function FinanceWorkspace() {
  const t = useTranslations("Dashboard.Finance");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [customerFilter, setCustomerFilter] = useState<CustomerFilterValue>("all");
  const [reconciliationFilter, setReconciliationFilter] = useState<ReconciliationFilterValue>("all");
  // Which Status/Customer/Reconciliation dropdown (if any) is open — owned here rather than
  // inside a toolbar so the Escape handler below can tell a dropdown is open and let its own
  // Escape close it first, instead of closing the Finance Detail overlay in the same keypress.
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const normalizedQuery = query.replace(/#/g, "");
    return FINANCE_INVOICES.filter((invoice) => {
      if (statusFilter !== "all" && invoice.status !== statusFilter) return false;
      if (customerFilter !== "all" && invoice.customerId !== customerFilter) return false;
      if (reconciliationFilter !== "all") {
        // A Draft isn't an active receivable yet — getInvoiceReconciliationState's "pending"
        // fallback for it is an internal default, not a real reconciliation fact, so it must
        // never surface as a match under a specific reconciliation filter (only under "all").
        if (invoice.status === "draft") return false;
        if (getInvoiceReconciliationState(invoice.id) !== reconciliationFilter) return false;
      }
      if (!query) return true;
      const customer = getFinanceCustomer(invoice.customerId);
      const operation = getFinanceOperation(invoice.operationId);
      const haystack = `${invoice.id} ${customer?.name ?? ""} ${operation?.id ?? ""}`.toLowerCase();
      if (haystack.includes(query)) return true;
      return haystack.replace(/#/g, "").includes(normalizedQuery);
    });
  }, [searchQuery, statusFilter, customerFilter, reconciliationFilter]);

  // Reset selection when the active filters change and the previously-selected row is no longer
  // among the results — computed during render, per React's guidance for adjusting state from a
  // changing input rather than via an Effect (mirrors InventoryWorkspace/CustomersWorkspace).
  const filterKey = `${searchQuery}|${statusFilter}|${customerFilter}|${reconciliationFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedInvoiceId && !filteredInvoices.some((invoice) => invoice.id === selectedInvoiceId)) {
      setSelectedInvoiceId(null);
    }
  }

  useEffect(() => {
    if (!selectedInvoiceId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A dropdown owns this Escape if one is open — its own handler closes it on this same
      // keypress. Skip closing the detail overlay so the two layers close one at a time:
      // dropdown first, detail on the next Escape.
      if (openFilter) return;
      setSelectedInvoiceId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedInvoiceId, openFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== "all" || customerFilter !== "all" || reconciliationFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCustomerFilter("all");
    setReconciliationFilter("all");
  };

  const selectedInvoice = filteredInvoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;
  const { statusOptions, customerOptions, reconciliationOptions } = buildFinanceFilterOptions(t);

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
              ariaLabel={t("toolbar.allStatuses")}
              open={openFilter === "status"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
            />
            <CustomerFilterDropdown
              value={customerFilter}
              options={customerOptions}
              onChange={setCustomerFilter}
              ariaLabel={t("toolbar.allCustomers")}
              open={openFilter === "customer"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "customer" : null)}
            />
            <CustomerFilterDropdown
              value={reconciliationFilter}
              options={reconciliationOptions}
              onChange={setReconciliationFilter}
              ariaLabel={t("toolbar.allReconciliation")}
              open={openFilter === "reconciliation"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "reconciliation" : null)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredInvoices.length })}
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

        <FinanceMobileList
          rows={filteredInvoices}
          selectedId={selectedInvoiceId}
          onSelect={setSelectedInvoiceId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedInvoice && (
          <FinanceDetailMobile invoice={selectedInvoice} onClose={() => setSelectedInvoiceId(null)} />
        )}
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
            {t("newInvoice")}
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
            ariaLabel={t("toolbar.allStatuses")}
            open={openFilter === "status"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
          />
          <CustomerFilterDropdown
            value={customerFilter}
            options={customerOptions}
            onChange={setCustomerFilter}
            ariaLabel={t("toolbar.allCustomers")}
            open={openFilter === "customer"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "customer" : null)}
          />
          <CustomerFilterDropdown
            value={reconciliationFilter}
            options={reconciliationOptions}
            onChange={setReconciliationFilter}
            ariaLabel={t("toolbar.allReconciliation")}
            open={openFilter === "reconciliation"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "reconciliation" : null)}
          />

          {hasActiveFilters && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredInvoices.length })}
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

        <FinanceMobileList
          rows={filteredInvoices}
          selectedId={selectedInvoiceId}
          onSelect={setSelectedInvoiceId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedInvoice && (
          <FinanceDetailMobile invoice={selectedInvoice} onClose={() => setSelectedInvoiceId(null)} />
        )}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2E.3 */}
      <FinanceDesktop
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        customerFilter={customerFilter}
        onCustomerChange={setCustomerFilter}
        reconciliationFilter={reconciliationFilter}
        onReconciliationChange={setReconciliationFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={setOpenFilter}
        filteredInvoices={filteredInvoices}
        selectedId={selectedInvoiceId}
        onSelectRow={setSelectedInvoiceId}
        selectedInvoice={selectedInvoice}
        onCloseDetail={() => setSelectedInvoiceId(null)}
      />
    </>
  );
}
