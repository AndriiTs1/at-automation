"use client";

import { useEffect, useState } from "react";
import { FINANCE_INVOICES } from "@/lib/demo-data";
import FinanceDesktop from "./FinanceDesktop";

/**
 * Top-level Finance workspace (Stage 2E.2) — owns selectedInvoiceId and closes the detail
 * overlay on Escape. No filters exist yet (Stage 2E.3), so this uses the simple single-layer
 * Escape pattern rather than Inventory/Customers' dropdown-aware layering.
 */
export default function FinanceWorkspace() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedInvoiceId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedInvoiceId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedInvoiceId]);

  const selectedInvoice = FINANCE_INVOICES.find((invoice) => invoice.id === selectedInvoiceId) ?? null;

  return (
    <FinanceDesktop
      selectedId={selectedInvoiceId}
      onSelectRow={setSelectedInvoiceId}
      selectedInvoice={selectedInvoice}
      onCloseDetail={() => setSelectedInvoiceId(null)}
    />
  );
}
