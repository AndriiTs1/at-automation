"use client";

import { useTranslations } from "next-intl";
import {
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceOutstanding,
  getInvoiceReconciliationState,
  type FinanceInvoice,
} from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-600",
  sent: "bg-accent/10 text-accent",
  overdue: "bg-error/10 text-error",
  paid: "bg-success/10 text-success",
};

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Dense invoice list for tablet and mobile (Stage 2E.4) — mirrors InventoryMobileList's pattern:
 * one reusable presentation shared by both breakpoints, since the priority fields and
 * interaction model are identical; only surrounding header/KPI/toolbar markup differs per
 * breakpoint. Finance's mobile priority is receivables math — Outstanding leads Total, mirroring
 * the desktop table's own identity → customer → status → money hierarchy — with a "Needs review"
 * reconciliation tag surfaced directly on the card (the Stage 2E.3 exception scenario must be
 * discoverable without opening Detail) and a secondary "Paid" line for a partially-paid invoice
 * (Harborline) so its payment isn't hidden. A Draft shows only Total, never Outstanding — showing
 * Outstanding for an unissued invoice would imply it's a receivable, which Stage 2E.2's
 * Draft-safety rule explicitly forbids. The desktop table (FinanceTable) is untouched and not
 * reused here.
 */
export default function FinanceMobileList({
  rows,
  selectedId,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: FinanceInvoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Finance");

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-10 text-center">
        <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
        <p className="text-xs text-neutral-400">{t("toolbar.noResultsHint")}</p>
        {hasActiveFilters && onClearFilters && (
          <button type="button" onClick={onClearFilters} className="text-xs font-medium text-accent hover:underline">
            {t("toolbar.clearFilters")}
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((invoice) => {
        const customer = getFinanceCustomer(invoice.customerId);
        const operation = getFinanceOperation(invoice.operationId);
        const outstanding = getInvoiceOutstanding(invoice);
        const reconciliationState = getInvoiceReconciliationState(invoice.id);
        const isDraft = invoice.status === "draft";
        const isSelected = invoice.id === selectedId;
        // A matched partial payment on a still-open invoice (Harborline) — never shown for a
        // fully paid invoice (already communicated via Outstanding = 0) or a Draft (no payments
        // are possible before it's issued).
        const showPartialPaidLine = !isDraft && invoice.status !== "paid" && invoice.paidAmount > 0;

        return (
          <li key={invoice.id}>
            <button
              type="button"
              onClick={() => onSelect(invoice.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{invoice.id}</p>
                  <p className="truncate text-xs text-neutral-400">{customer?.name ?? invoice.customerId}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[invoice.status]}`}
                >
                  {t(`status.${invoice.status}`)}
                </span>
              </div>

              {/* Reconciliation exception tag — deliberately only shown for "exception" (Needs
                  review): a neutral "Pending"/"Reconciled" tag on every card would be visual
                  noise for the common case. Uses the warning tone, distinct from every invoice
                  status color (accent/error/success/neutral), so the two status families never
                  read as the same signal. */}
              {reconciliationState === "exception" && (
                <span className="inline-flex w-fit items-center rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                  {t("detail.reconciliationState.exception")}
                </span>
              )}

              {isDraft ? (
                <div className="text-xs">
                  <p className="text-[11px] text-neutral-400">{t("table.total")}</p>
                  <p className="mt-0.5 font-semibold text-foreground">{formatChf(invoice.total)}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] text-neutral-400">{t("table.outstanding")}</p>
                    <p
                      className={`mt-0.5 ${outstanding === 0 ? "text-neutral-400" : "font-semibold text-foreground"}`}
                    >
                      {formatChf(outstanding)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] text-neutral-400">{t("table.total")}</p>
                    <p className="mt-0.5 text-neutral-600">{formatChf(invoice.total)}</p>
                  </div>
                </div>
              )}

              {showPartialPaidLine && (
                <p className="text-xs text-success">
                  {t("summary.paid")} {formatChf(invoice.paidAmount)}
                </p>
              )}

              <p className="truncate text-xs text-neutral-500">
                {t("table.due")} {invoice.dueDate}
                {operation ? ` · ${operation.id}` : ""}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
