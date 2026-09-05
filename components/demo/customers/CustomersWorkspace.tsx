"use client";

import { useEffect, useState } from "react";
import { CUSTOMERS_ROWS } from "@/lib/demo-data";
import CustomerDetailPanel from "./CustomerDetailPanel";
import CustomersTable from "./CustomersTable";

/**
 * Smallest client boundary needed for Customers row selection (Stage 2C.2). Owns
 * selectedCustomerId only — the static header/KPIs/toolbar in CustomersDesktop stay outside
 * client state.
 */
export default function CustomersWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedCustomer = CUSTOMERS_ROWS.find((row) => row.id === selectedId) ?? null;

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <CustomersTable
        rows={CUSTOMERS_ROWS}
        selectedId={selectedId}
        onSelect={setSelectedId}
        panelOpen={selectedCustomer !== null}
      />
      {selectedCustomer && <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
