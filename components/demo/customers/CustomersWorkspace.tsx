"use client";

import { useEffect, useMemo, useState } from "react";
import { CUSTOMERS_ROWS } from "@/lib/demo-data";
import CustomerDetailPanel from "./CustomerDetailPanel";
import CustomersTable from "./CustomersTable";
import CustomersToolbar, { type HealthFilterValue, type SegmentFilterValue } from "./CustomersToolbar";

/**
 * Client boundary for Customers row selection and filtering (Stage 2C.3). Owns
 * selectedCustomerId, searchQuery, segmentFilter and healthFilter — the static header/KPIs
 * in CustomersDesktop stay outside client state. filteredCustomers is derived directly from
 * CUSTOMERS_ROWS on every render (no separate state, no mutation, no duplication).
 */
export default function CustomersWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilterValue>("all");
  const [healthFilter, setHealthFilter] = useState<HealthFilterValue>("all");

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return CUSTOMERS_ROWS.filter((row) => {
      if (segmentFilter !== "all" && row.segment !== segmentFilter) return false;
      if (healthFilter !== "all" && row.health !== healthFilter) return false;
      if (!query) return true;
      return (
        row.name.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query) ||
        row.owner.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, segmentFilter, healthFilter]);

  // Reset selection when the active filters change and the previously-selected row is no
  // longer among the results — computed during render, per React's guidance for adjusting
  // state from a changing input rather than via an Effect (mirrors OperationsWorkspace).
  const filterKey = `${searchQuery}|${segmentFilter}|${healthFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedId && !filteredCustomers.some((row) => row.id === selectedId)) {
      setSelectedId(null);
    }
  }

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const hasActiveFilters = searchQuery.trim() !== "" || segmentFilter !== "all" || healthFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSegmentFilter("all");
    setHealthFilter("all");
  };

  const selectedCustomer = filteredCustomers.find((row) => row.id === selectedId) ?? null;

  return (
    <>
      <CustomersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        segmentFilter={segmentFilter}
        onSegmentChange={setSegmentFilter}
        healthFilter={healthFilter}
        onHealthChange={setHealthFilter}
        resultCount={filteredCustomers.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />
      <div className="flex min-h-0 flex-1 gap-3">
        <CustomersTable
          rows={filteredCustomers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          panelOpen={selectedCustomer !== null}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
        {selectedCustomer && <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedId(null)} />}
      </div>
    </>
  );
}
