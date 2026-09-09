"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { getCustomerOutstanding, type CustomerRow } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const HEALTH_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  watch: "bg-warning/10 text-warning",
  atRisk: "bg-error/10 text-error",
};

const SEGMENT_TONE: Record<string, string> = {
  keyAccount: "bg-neutral-100 font-semibold text-neutral-700",
  standard: "bg-neutral-100 text-neutral-500",
  new: "bg-neutral-100 text-neutral-500",
};

/** Shared by CustomersTable and CustomersMobileList so both format relative activity identically. */
export function formatLastActivity(entry: CustomerRow["lastActivity"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

const TABLE_COLUMN_COUNT = 8;
const TABLE_COLUMN_COUNT_COMPACT = 5;
const MIN_TABLE_WIDTH = 880;
// Comfortably fits Customer/Health/Open operations/Revenue/Outstanding at their own measured
// minimums (see COLUMN_WIDTHS_COMPACT below) well under the ~776px the workspace actually leaves
// once the 420px inspector is open — the table then stretches to fill that real width via
// `w-full`, so this is a floor, not the rendered width.
const MIN_TABLE_WIDTH_COMPACT = 640;

/**
 * Explicit column-width percentages (table-layout: fixed) — Customer, Segment, Health, Open
 * operations, Revenue, Outstanding, Owner, Last activity. Without this, the browser's default
 * auto table layout resizes every column from whichever rows happen to be visible, so filtering
 * from 10 rows down to 1 visibly shifts every column left/right by 10-40px even though nothing
 * about the table's own container changes.
 *
 * Widths are derived from measured natural (unconstrained) content needs across locales, not
 * guessed — the longest real values in this dataset are the customer name "Crestwood
 * Manufacturing" (~173px) and, for Segment/Health, Russian/Ukrainian labels ("Ключевой клиент",
 * "Спостереження") that render wider than their English equivalents. Every column here gets at
 * least that measured minimum, so no locale's longest label clips.
 *
 * Open operations/Outstanding/Owner were rebalanced (borrowing a little from Health/Last
 * activity, which measured comfortable slack) once centering the Open operations header exposed
 * that Russian "Открытые операции" needs far more width than the single-digit values below it
 * ever will — that header is also allowed to wrap to two lines (see the header cell below) since
 * it breaks cleanly at a word boundary and still centers correctly over the value either way.
 */
const COLUMN_WIDTHS = ["18%", "13%", "10%", "6%", "11%", "13%", "12%", "17%"];

/**
 * Compact 5-column set used only while the desktop inspector is open (Stage: inspector-open
 * table density). Segment/Owner/Last activity drop out — they're secondary context already
 * visible inside the open inspector for that customer — and Customer gets significantly more
 * width (40% vs 18% full-width) since it's the primary identifier and must not be the column
 * that loses space to the 420px inspector. Health/Open operations/Revenue/Outstanding keep
 * roughly their original proportions relative to each other, just scaled up to fill 100%.
 */
const COLUMN_WIDTHS_COMPACT = ["40%", "14%", "10%", "16%", "20%"];

/** Selectable Customers table — mirrors OperationsTable's row-selection pattern (Stage 2C.2). */
export default function CustomersTable({
  rows,
  selectedId,
  highlightedId = null,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: CustomerRow[];
  selectedId: string | null;
  /** Row connected to the active Scenario trace (Stage 2J.3) — visually treated the same as
   * `selectedId` (open detail), just a different reason a row earns the accent tint. */
  highlightedId?: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Customers");
  // The desktop inspector is open exactly when a detail is selected — reusing that existing state
  // rather than adding a new prop, per instructions to keep this Customers-specific and scoped to
  // the table alone (DetailInspectorShell stays unaware column visibility exists at all).
  const isInspectorOpen = selectedId !== null;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      <table
        className="w-full table-fixed border-collapse text-left text-sm"
        style={{ minWidth: `${isInspectorOpen ? MIN_TABLE_WIDTH_COMPACT : MIN_TABLE_WIDTH}px` }}
      >
        <colgroup>
          {(isInspectorOpen ? COLUMN_WIDTHS_COMPACT : COLUMN_WIDTHS).map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            {!isInspectorOpen && (
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.segment")}</th>
            )}
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.health")}</th>
            <th className="px-4 py-3 text-center font-medium leading-tight">{t("table.openOperations")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.revenue")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.outstanding")}</th>
            {!isInspectorOpen && (
              <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.owner")}</th>
            )}
            {!isInspectorOpen && <th className="px-4 py-3 text-right font-medium">{t("table.lastActivity")}</th>}
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
            rows.map((row) => {
              const isSelected = row.id === selectedId;
              const isHighlighted = isSelected || row.id === highlightedId;
              return (
                <tr
                  key={row.id}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => onSelect(row.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, row.id)}
                  className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                    isHighlighted ? "bg-accent/5" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="truncate font-semibold text-foreground">{row.name}</p>
                    <p className="mt-0.5 truncate text-xs text-neutral-400">{row.id}</p>
                  </td>
                  {!isInspectorOpen && (
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs ${SEGMENT_TONE[row.segment]}`}
                      >
                        {t(`segment.${row.segment}`)}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${HEALTH_TONE[row.health]}`}
                    >
                      {t(`health.${row.health}`)}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-center whitespace-nowrap ${row.openOperations === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                  >
                    {row.openOperations}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">{row.revenue}</td>
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap ${getCustomerOutstanding(row.id) === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                  >
                    {formatChf(getCustomerOutstanding(row.id))}
                  </td>
                  {!isInspectorOpen && (
                    <td className="truncate px-4 py-3 text-center text-neutral-600">{row.owner}</td>
                  )}
                  {!isInspectorOpen && (
                    <td className="truncate px-4 py-3 text-right text-xs text-neutral-400">
                      {formatLastActivity(row.lastActivity, t)}
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
