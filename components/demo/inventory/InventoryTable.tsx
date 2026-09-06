"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { getAvailableUnits, type InventoryItem } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  low: "bg-warning/10 text-warning",
  critical: "bg-error/10 text-error",
  outOfStock: "bg-neutral-200 text-neutral-600",
};

function formatUpdated(entry: InventoryItem["updated"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

function formatValue(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Explicit column-width percentages (table-layout: fixed) — Item, Status, On hand, Reserved,
 * Available, Reorder point, Location, Value, Updated. Fixed geometry from the start (rather
 * than table-layout: auto) so Stage 2D.3's future filtering can't shift columns the way an
 * auto layout would when the visible row count changes — the same fix Customers needed only
 * after the fact.
 *
 * Percentages are sized against MIN_TABLE_WIDTH (not guessed) from live-measured worst-case
 * content across all 6 locales — e.g. the Status badge "Немає в наявності" (uk, out of stock,
 * ~155px with badge+cell padding), the wrapped "Reorder point" header's longest single word
 * "réapprovisionnement" (fr, ~144px), and "Yesterday, 16:40" (en, the longest relative-time
 * value, ~121px) — each column keeps a ≥5px margin over its measured minimum at that width.
 *
 * "Reorder point" and "Location" are the two headers allowed to wrap to a second line (see
 * their <th> below, plus break-words as a safety net for the one long unbreakable French
 * word) since several locales (French "Seuil de réapprovisionnement", Russian
 * "Местоположение") run meaningfully longer than their English source.
 */
const MIN_TABLE_WIDTH = 1190;
const COLUMN_WIDTHS = ["16%", "14%", "9%", "8%", "9%", "13%", "12%", "8%", "11%"];
const TABLE_COLUMN_COUNT = 9;

/**
 * Selectable, filterable Inventory table (Stage 2D.3) — mirrors CustomersTable's row-selection
 * and empty-state pattern exactly. `rows` is caller-filtered (INVENTORY_ROWS is never mutated
 * or duplicated); geometry (table-layout: fixed, colgroup widths, min-width) is frozen and
 * unchanged from Stage 2D.1/2D.2 regardless of how many rows are passed in. Available is
 * derived via getAvailableUnits rather than trusting a stored field, and Value is derived as
 * onHand × unitValue rather than a separately stored total, so neither can drift out of sync
 * with its source numbers.
 */
export default function InventoryTable({
  rows,
  selectedId,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: InventoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Inventory");

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
        style={{ minWidth: `${MIN_TABLE_WIDTH}px` }}
      >
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">{t("table.item")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.status")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.onHand")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.reserved")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.available")}</th>
            <th className="px-4 py-3 text-center font-medium leading-tight break-words">{t("table.reorderPoint")}</th>
            <th className="px-4 py-3 text-center font-medium leading-tight break-words">{t("table.location")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.value")}</th>
            <th className="px-4 py-3 text-right font-medium">{t("table.updated")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={TABLE_COLUMN_COUNT} className="px-4 py-12 text-center">
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
            rows.map((item) => {
              const available = getAvailableUnits(item);
              const value = item.onHand * item.unitValue;
              const isSelected = item.id === selectedId;
              return (
                <tr
                  key={item.id}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => onSelect(item.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, item.id)}
                  className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                    isSelected ? "bg-accent/5" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="truncate font-semibold text-foreground">{item.name}</p>
                    <p className="mt-0.5 truncate text-xs text-neutral-400">{item.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[item.status]}`}
                    >
                      {t(`status.${item.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap text-foreground">{item.onHand}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap text-neutral-600">{item.reserved}</td>
                  <td
                    className={`px-4 py-3 text-center whitespace-nowrap ${available === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                  >
                    {available}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap text-neutral-500">{item.reorderPoint}</td>
                  <td className="truncate px-4 py-3 text-center text-neutral-600">{item.location}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">
                    {formatValue(value)}
                  </td>
                  <td className="truncate px-4 py-3 text-right text-xs text-neutral-400">
                    {formatUpdated(item.updated, t)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
