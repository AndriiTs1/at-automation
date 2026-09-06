"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FINANCE_INVOICES,
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceReconciliationState,
} from "@/lib/demo-data";
import FinanceDesktop from "./FinanceDesktop";
import {
  type CustomerFilterValue,
  type OpenFilter,
  type ReconciliationFilterValue,
  type StatusFilterValue,
} from "./FinanceToolbar";

/**
 * Top-level Finance workspace (Stage 2E.3) — owns selectedInvoiceId plus all filter state
 * (searchQuery/statusFilter/customerFilter/reconciliationFilter/openFilter) and derives
 * filteredInvoices once via useMemo, mirroring InventoryWorkspace's architecture exactly.
 * FINANCE_INVOICES stays the single, unfiltered source of truth; no separate filtered dataset,
 * no per-component filtering logic.
 */
export default function FinanceWorkspace() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [customerFilter, setCustomerFilter] = useState<CustomerFilterValue>("all");
  const [reconciliationFilter, setReconciliationFilter] = useState<ReconciliationFilterValue>("all");
  // Which Status/Customer/Reconciliation dropdown (if any) is open — owned here rather than
  // inside the toolbar so the Escape handler below can tell a dropdown is open and let its own
  // Escape close it first, instead of closing the Finance Detail drawer in the same keypress.
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

  return (
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
  );
}
