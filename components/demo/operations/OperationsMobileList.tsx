"use client";

import { useTranslations } from "next-intl";
import type { OperationRow } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

/**
 * Dense, card-free operation list for tablet and mobile — a single reusable presentation
 * for both, since the priority fields (id, customer, status, stage, owner, value, updated)
 * and interaction model are identical; only surrounding layout differs by breakpoint.
 */
export default function OperationsMobileList({
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

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-10 text-center">
        <p className="text-sm text-neutral-500">{t("toolbar.noResults")}</p>
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
      {rows.map((row) => {
        const isSelected = row.id === selectedId;
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect(row.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{row.id}</span>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[row.status]}`}
                >
                  {t(`status.${row.status}`)}
                </span>
              </div>
              <p className="truncate text-sm text-neutral-600">{row.customer}</p>
              <p className="truncate text-xs text-neutral-500">{t(`stage.${row.stage}`)}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-neutral-500">{row.owner}</span>
                <span className="shrink-0 text-sm font-semibold text-foreground">{row.value}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {t("table.updated")} {row.updated}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
