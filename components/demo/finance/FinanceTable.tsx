"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import {
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceOutstanding,
  type FinanceInvoice,
} from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-600",
  sent: "bg-accent/10 text-accent",
  overdue: "bg-error/10 text-error",
  paid: "bg-success/10 text-success",
};

function formatUpdated(entry: FinanceInvoice["updated"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Explicit column-width percentages (table-layout: fixed) — Invoice, Customer, Status,
 * Operation, Issued, Due, Total, Outstanding, Updated. Fixed geometry from the start (rather
 * than table-layout: auto), matching Customers/Inventory's own proven approach so a future
 * filtering stage (2E.3) can't shift columns when the visible row count changes.
 *
 * Percentages are sized against MIN_TABLE_WIDTH from live-measured worst-case content across
 * all 6 locales (not guessed) — e.g. the invoice id "INV-2026-2001" (~95px), the longest
 * customer name "Harborline Logistics" (~136px), and the longest relative-time value
 * "Yesterday, 11:15" (en, ~88px) — each column keeps a ≥10px margin over its measured minimum
 * at 1190px. Invoice/Customer intentionally carry more width than Status/Operation/dates, per
 * the identity → customer → status business hierarchy.
 */
const MIN_TABLE_WIDTH = 1190;
const COLUMN_WIDTHS = ["12%", "16%", "12%", "9%", "9%", "11%", "9%", "11%", "11%"];
const TABLE_COLUMN_COUNT = 9;
const TABLE_COLUMN_COUNT_COMPACT = 5;
// Comfortably fits Invoice/Customer/Status/Operation/Outstanding at their own measured minimums
// (see COLUMN_WIDTHS_COMPACT below) well under the ~776px the workspace leaves once the 420px
// inspector is open — the table stretches to fill that real width via `w-full`, so this is a
// floor, not the rendered width (mirrors CustomersTable/InventoryTable's identical pattern).
const MIN_TABLE_WIDTH_COMPACT = 620;

/**
 * Compact 5-column set used only while the desktop inspector is open. Issued/Due/Total/Updated
 * drop out — they're secondary context already visible inside the open inspector for that
 * invoice — and Customer gets significantly more width (38% vs 16% full-width) since it's the
 * field most likely to need it (longest name "Harborline Logistics"), while Invoice and
 * Outstanding both keep generous margins over their own measured minimums.
 */
const COLUMN_WIDTHS_COMPACT = ["20%", "38%", "16%", "12%", "14%"];

// Below @6xl (1152px container width — comfortably between the ~1024px tablet case and the
// ~1440px desktop case, using the same named container-query scale @lg/@3xl/@5xl already
// established elsewhere in this app) the 5-column open-state table has too little room: Status/
// Operation/Outstanding squeeze down far enough that Invoice/Customer end up clipped too. Rather
// than let that happen, a second even-more-compact table takes over at that width — Invoice +
// Customer only, matching CustomersTable/InventoryTable's own tablet behavior at the same
// breakpoint. This is a second complete `<table>` (own colgroup/thead/tbody), CSS-toggled via
// @6xl, not a third JS-driven column-set — table-fixed colgroup percentages can't be reliably
// recalculated by hiding individual `<col>`s, so two small self-contained tables is the robust
// approach (mirrors how this app already keeps mobile/tablet/desktop as separate trees).
const MIN_TABLE_WIDTH_TABLET_COMPACT = 320;
const COLUMN_WIDTHS_TABLET_COMPACT = ["38%", "62%"];
const TABLE_COLUMN_COUNT_TABLET_COMPACT = 2;

// Same @6xl split, for the CLOSED table: at tablet width the full 9-column table (1190px
// minimum) no longer fits its own ~778px container — the wrapper's overflow-auto was clipping it
// after "Issued" with no visible scroll affordance, a real bug. Below @6xl, this narrower
// 5-column set (Invoice/Customer/Status/Outstanding/Updated) takes over instead — Operation/
// Issued/Due/Total drop out as the least essential at a glance; Updated is kept (unlike the
// open-state compact tables) since there's no inspector open to surface it elsewhere.
const MIN_TABLE_WIDTH_CLOSED_TABLET = 680;
const COLUMN_WIDTHS_CLOSED_TABLET = ["20%", "30%", "15%", "16%", "19%"];
const TABLE_COLUMN_COUNT_CLOSED_TABLET = 5;

/**
 * Selectable, filterable Finance table (Stage 2E.3) — mirrors InventoryTable's row-selection and
 * empty-state pattern exactly (tabIndex, onClick/onKeyDown for Enter/Space, aria-selected,
 * selected-row tint). `rows` is caller-filtered (FINANCE_INVOICES is never mutated or
 * duplicated); geometry (table-layout: fixed, colgroup widths, min-width) is frozen and unchanged
 * from Stage 2E.1/2E.2 regardless of how many rows are passed in. Customer and connected
 * operation are resolved live via getFinanceCustomer/getFinanceOperation rather than duplicated
 * onto the invoice, and Outstanding is derived via getInvoiceOutstanding rather than trusting a
 * stored field, so neither can drift out of sync with total/paidAmount.
 */
export default function FinanceTable({
  rows,
  selectedId,
  highlightedId = null,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: FinanceInvoice[];
  selectedId: string | null;
  /** Row connected to the active Scenario trace (Stage 2J.3) — visually treated the same as
   * `selectedId` (open detail), just a different reason a row earns the accent tint. */
  highlightedId?: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Finance");
  // The desktop inspector is open exactly when an invoice is selected — reusing that existing
  // state rather than adding a new prop, mirroring CustomersTable/InventoryTable's identical
  // pattern.
  const isInspectorOpen = selectedId !== null;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      {isInspectorOpen ? (
        <table
          className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
          style={{ minWidth: `${MIN_TABLE_WIDTH_TABLET_COMPACT}px` }}
        >
          <colgroup>
            {COLUMN_WIDTHS_TABLET_COMPACT.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">{t("table.invoice")}</th>
              <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT_TABLET_COMPACT} className="px-4 py-12 text-center">
                  <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
                  <p className="mt-1 text-xs text-neutral-400">{t("toolbar.noResultsHint")}</p>
                  {hasActiveFilters && onClearFilters && (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="mt-2 text-xs font-medium text-accent hover:underline"
                    >
                      {t("toolbar.clearFilters")}
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((invoice) => {
                const customer = getFinanceCustomer(invoice.customerId);
                const isSelected = invoice.id === selectedId;
                const isHighlighted = isSelected || invoice.id === highlightedId;
                return (
                  <tr
                    key={invoice.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onSelect(invoice.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, invoice.id)}
                    className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                      isHighlighted ? "bg-accent/5" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <td className="truncate px-4 py-3 font-semibold text-foreground">{invoice.id}</td>
                    <td className="truncate px-4 py-3 text-neutral-600">{customer?.name ?? invoice.customerId}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      ) : (
        <table
          className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
          style={{ minWidth: `${MIN_TABLE_WIDTH_CLOSED_TABLET}px` }}
        >
          <colgroup>
            {COLUMN_WIDTHS_CLOSED_TABLET.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">{t("table.invoice")}</th>
              <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.status")}</th>
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.outstanding")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("table.updated")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT_CLOSED_TABLET} className="px-4 py-12 text-center">
                  <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
                  <p className="mt-1 text-xs text-neutral-400">{t("toolbar.noResultsHint")}</p>
                  {hasActiveFilters && onClearFilters && (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="mt-2 text-xs font-medium text-accent hover:underline"
                    >
                      {t("toolbar.clearFilters")}
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((invoice) => {
                const customer = getFinanceCustomer(invoice.customerId);
                const outstanding = getInvoiceOutstanding(invoice);
                const isSelected = invoice.id === selectedId;
                const isHighlighted = isSelected || invoice.id === highlightedId;
                return (
                  <tr
                    key={invoice.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onSelect(invoice.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, invoice.id)}
                    className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                      isHighlighted ? "bg-accent/5" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <td className="truncate px-4 py-3 font-semibold text-foreground">{invoice.id}</td>
                    <td className="truncate px-4 py-3 text-neutral-600">{customer?.name ?? invoice.customerId}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[invoice.status]}`}
                      >
                        {t(`status.${invoice.status}`)}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right whitespace-nowrap ${outstanding === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                    >
                      {formatChf(outstanding)}
                    </td>
                    <td className="truncate px-4 py-3 text-right text-xs text-neutral-400">
                      {formatUpdated(invoice.updated, t)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
      <table
        className="hidden w-full table-fixed border-collapse text-left text-sm @6xl:table"
        style={{ minWidth: `${isInspectorOpen ? MIN_TABLE_WIDTH_COMPACT : MIN_TABLE_WIDTH}px` }}
      >
        <colgroup>
          {(isInspectorOpen ? COLUMN_WIDTHS_COMPACT : COLUMN_WIDTHS).map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">{t("table.invoice")}</th>
            <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.status")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.operation")}</th>
            {!isInspectorOpen && (
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.issued")}</th>
            )}
            {!isInspectorOpen && (
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.due")}</th>
            )}
            {!isInspectorOpen && (
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.total")}</th>
            )}
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.outstanding")}</th>
            {!isInspectorOpen && <th className="px-4 py-3 text-right font-medium">{t("table.updated")}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={isInspectorOpen ? TABLE_COLUMN_COUNT_COMPACT : TABLE_COLUMN_COUNT}
                className="px-4 py-12 text-center"
              >
                <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
                <p className="mt-1 text-xs text-neutral-400">{t("toolbar.noResultsHint")}</p>
                {hasActiveFilters && onClearFilters && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-2 text-xs font-medium text-accent hover:underline"
                  >
                    {t("toolbar.clearFilters")}
                  </button>
                )}
              </td>
            </tr>
          ) : (
            rows.map((invoice) => {
              const customer = getFinanceCustomer(invoice.customerId);
              const operation = getFinanceOperation(invoice.operationId);
              const outstanding = getInvoiceOutstanding(invoice);
              const isSelected = invoice.id === selectedId;
              const isHighlighted = isSelected || invoice.id === highlightedId;
              return (
                <tr
                  key={invoice.id}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => onSelect(invoice.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, invoice.id)}
                  className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                    isHighlighted ? "bg-accent/5" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <td className="truncate px-4 py-3 font-semibold text-foreground">{invoice.id}</td>
                  <td className="truncate px-4 py-3 text-neutral-600">{customer?.name ?? invoice.customerId}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[invoice.status]}`}
                    >
                      {t(`status.${invoice.status}`)}
                    </span>
                  </td>
                  <td className="truncate px-4 py-3 text-center text-neutral-500">
                    {operation ? operation.id : "—"}
                  </td>
                  {!isInspectorOpen && (
                    <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-500">{invoice.issueDate}</td>
                  )}
                  {!isInspectorOpen && (
                    <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-500">{invoice.dueDate}</td>
                  )}
                  {!isInspectorOpen && (
                    <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">
                      {formatChf(invoice.total)}
                    </td>
                  )}
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap ${outstanding === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                  >
                    {formatChf(outstanding)}
                  </td>
                  {!isInspectorOpen && (
                    <td className="truncate px-4 py-3 text-right text-xs text-neutral-400">
                      {formatUpdated(invoice.updated, t)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
