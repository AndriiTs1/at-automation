"use client";

import { useTranslations } from "next-intl";
import { formatLastActivity } from "./CustomersTable";
import type { CustomerRow } from "@/lib/demo-data";

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

/**
 * Dense stacked customer list for tablet and mobile (Stage 2C.4) — mirrors
 * OperationsMobileList's pattern: one reusable presentation shared by both breakpoints, since
 * the priority fields and interaction model are identical; only the surrounding header/KPI/
 * toolbar markup differs per breakpoint. The desktop table (CustomersTable) is untouched and
 * not reused here.
 */
export default function CustomersMobileList({
  rows,
  selectedId,
  onSelect,
  hasActiveFilters,
  onClearFilters,
}: {
  rows: CustomerRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) {
  const t = useTranslations("Dashboard.Customers");

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
      {rows.map((row) => {
        const isSelected = row.id === selectedId;
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onSelect(row.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.name}</p>
                  <p className="text-xs text-neutral-400">{row.id}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-400">{formatLastActivity(row.lastActivity, t)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-[11px] ${SEGMENT_TONE[row.segment]}`}
                >
                  {t(`segment.${row.segment}`)}
                </span>
                <span
                  className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-[11px] font-medium ${HEALTH_TONE[row.health]}`}
                >
                  {t(`health.${row.health}`)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.openOperations")}</p>
                  <p className={`mt-0.5 ${row.openOperations === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}>
                    {row.openOperations}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.revenue")}</p>
                  <p className="mt-0.5 truncate font-medium text-foreground">{row.revenue}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-neutral-400">{t("table.outstanding")}</p>
                  <p
                    className={`mt-0.5 truncate ${row.outstanding === "CHF 0" ? "text-neutral-400" : "font-medium text-foreground"}`}
                  >
                    {row.outstanding}
                  </p>
                </div>
              </div>

              <p className="truncate text-xs text-neutral-500">{row.owner}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
