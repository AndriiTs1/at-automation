"use client";

import { useTranslations } from "next-intl";
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
 * Dense stock list for tablet and mobile (Stage 2D.4) — mirrors CustomersMobileList's pattern:
 * one reusable presentation shared by both breakpoints, since the priority fields and
 * interaction model are identical; only surrounding header/KPI/toolbar markup differs per
 * breakpoint. Unlike Customers, Inventory's mobile priority is stock math — Available,
 * Reserved and Reorder point are the primary scannable row, with On hand/Location/Value
 * secondary — so this does not just copy Customers' card shape. The desktop table
 * (InventoryTable) is untouched and not reused here.
 */
export default function InventoryMobileList({
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
      {rows.map((item) => {
        const available = getAvailableUnits(item);
        const value = item.onHand * item.unitValue;
        const isSelected = item.id === selectedId;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-neutral-400">{item.sku}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[item.status]}`}
                >
                  {t(`status.${item.status}`)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.available")}</p>
                  <p className={`mt-0.5 ${available === 0 ? "text-neutral-400" : "font-semibold text-foreground"}`}>
                    {available}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.reserved")}</p>
                  <p className="mt-0.5 text-neutral-600">{item.reserved}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.reorderPoint")}</p>
                  <p className="mt-0.5 text-neutral-500">{item.reorderPoint}</p>
                </div>
              </div>

              <p className="truncate text-xs text-neutral-500">
                {t("table.onHand")} {item.onHand} · {item.location}
              </p>

              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{formatValue(value)}</span>
                <span className="shrink-0 text-xs text-neutral-400">{formatUpdated(item.updated, t)}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
