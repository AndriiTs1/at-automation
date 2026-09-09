"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import type { OperationRow } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

const TABLE_COLUMN_COUNT = 7;

// Below @6xl (1152px container width — the same breakpoint established for Finance's tablet
// split this session) with the workflow inspector open, the ~400px OperationDetailPanel leaves
// too little room for the full 7-column table: table-layout:auto's min-w-[720px] floor forces an
// overflow, and rather than a clean scrollbar it produces ugly internal squeeze/wrapping of
// Customer names and the Status pill. A second, smaller table (own colgroup, table-fixed) takes
// over at that width — Operation/Customer/Status only, the three columns still genuinely useful
// next to an open workflow inspector — CSS-toggled via @6xl exactly like Finance's tablet tables,
// gated by the same isInspectorOpen boolean already used across Customers/Inventory/Finance. The
// CLOSED table is untouched: it already fits cleanly at 1024px (measured 778px available vs a
// 720px floor), so no tablet-specific closed variant is needed.
const MIN_TABLE_WIDTH_OPEN_COMPACT = 320;
const COLUMN_WIDTHS_OPEN_COMPACT = ["22%", "45%", "33%"];
const TABLE_COLUMN_COUNT_OPEN_COMPACT = 3;

export default function OperationsTable({
  rows,
  selectedId,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: OperationRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Operations");
  // The desktop inspector is open exactly when an operation is selected — mirroring
  // CustomersTable/InventoryTable/FinanceTable's identical isInspectorOpen idiom.
  const isInspectorOpen = selectedId !== null;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      {isInspectorOpen && (
        <table
          className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
          style={{ minWidth: `${MIN_TABLE_WIDTH_OPEN_COMPACT}px` }}
        >
          <colgroup>
            {COLUMN_WIDTHS_OPEN_COMPACT.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">{t("table.operation")}</th>
              <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
              <th className="px-4 py-3 text-center font-medium">{t("table.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT_OPEN_COMPACT} className="px-4 py-12 text-center">
                  <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
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
                return (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onSelect(row.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, row.id)}
                    className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                      isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <td className="truncate px-4 py-3 font-semibold text-foreground">{row.id}</td>
                    <td className="truncate px-4 py-3 text-neutral-600">{row.customer}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[row.status]}`}
                      >
                        {t(`status.${row.status}`)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
      <table className={`w-full min-w-[720px] border-collapse text-left text-sm ${isInspectorOpen ? "hidden @6xl:table" : ""}`}>
        <thead>
          <tr className="border-b border-border text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">{t("table.operation")}</th>
            <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            <th className="px-4 py-3 font-medium">{t("table.status")}</th>
            <th className="px-4 py-3 font-medium">{t("table.stage")}</th>
            <th className="px-4 py-3 font-medium">{t("table.owner")}</th>
            <th className="px-4 py-3 text-right font-medium">{t("table.value")}</th>
            <th className="px-4 py-3 text-right font-medium">{t("table.updated")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={TABLE_COLUMN_COUNT} className="px-4 py-12 text-center">
                <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
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
              return (
                <tr
                  key={row.id}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => onSelect(row.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, row.id)}
                  className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                    isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">{row.id}</td>
                  <td className="px-4 py-3 text-neutral-600">{row.customer}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[row.status]}`}
                    >
                      {t(`status.${row.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{t(`stage.${row.stage}`)}</td>
                  <td className="px-4 py-3 text-neutral-600">{row.owner}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{row.value}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-neutral-400">{row.updated}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
