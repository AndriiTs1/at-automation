"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
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

function formatLastActivity(entry: CustomerRow["lastActivity"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

/**
 * Selectable Customers table — mirrors OperationsTable's row-selection pattern (Stage 2C.2).
 *
 * `panelOpen` drives a compact column composition used only while the 420px Customer Detail
 * panel is open, so the remaining table stays dense and legible instead of wrapping badges,
 * CHF values and owner names: secondary columns get tighter padding and forced single-line
 * text, the lowest-priority "Last activity" column drops (its info already lives in the open
 * panel's Recent Activity), and the table's min-width floor shrinks to match. The closed
 * (no-panel) composition is untouched.
 */
export default function CustomersTable({
  rows,
  selectedId,
  onSelect,
  panelOpen = false,
}: {
  rows: CustomerRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  panelOpen?: boolean;
}) {
  const t = useTranslations("Dashboard.Customers");

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  const secondaryPad = panelOpen ? "px-2" : "px-4";
  const nowrap = panelOpen ? "whitespace-nowrap" : "";

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      <table className={`w-full ${panelOpen ? "min-w-[740px]" : "min-w-[880px]"} border-collapse text-left text-sm`}>
        <thead>
          <tr className="border-b border-border text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            <th className={`${secondaryPad} py-3 font-medium ${nowrap}`}>{t("table.segment")}</th>
            <th className={`${secondaryPad} py-3 font-medium ${nowrap}`}>{t("table.health")}</th>
            <th className={`${secondaryPad} py-3 text-right font-medium ${nowrap}`}>{t("table.openOperations")}</th>
            <th className={`${secondaryPad} py-3 text-right font-medium ${nowrap}`}>{t("table.revenue")}</th>
            <th className={`${secondaryPad} py-3 text-right font-medium ${nowrap}`}>{t("table.outstanding")}</th>
            <th className={`${secondaryPad} py-3 font-medium ${nowrap}`}>{t("table.owner")}</th>
            {!panelOpen && <th className="px-4 py-3 text-right font-medium">{t("table.lastActivity")}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
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
                <td className="px-4 py-3">
                  <p className={`font-semibold text-foreground ${nowrap}`}>{row.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{row.id}</p>
                </td>
                <td className={`${secondaryPad} py-3`}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${nowrap} ${SEGMENT_TONE[row.segment]}`}
                  >
                    {t(`segment.${row.segment}`)}
                  </span>
                </td>
                <td className={`${secondaryPad} py-3`}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${nowrap} ${HEALTH_TONE[row.health]}`}
                  >
                    {t(`health.${row.health}`)}
                  </span>
                </td>
                <td
                  className={`${secondaryPad} py-3 text-right ${nowrap} ${row.openOperations === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                >
                  {row.openOperations}
                </td>
                <td className={`${secondaryPad} py-3 text-right font-medium text-foreground ${nowrap}`}>{row.revenue}</td>
                <td
                  className={`${secondaryPad} py-3 text-right ${nowrap} ${row.outstanding === "CHF 0" ? "text-neutral-400" : "font-medium text-foreground"}`}
                >
                  {row.outstanding}
                </td>
                <td className={`${secondaryPad} py-3 text-neutral-600 ${nowrap}`}>{row.owner}</td>
                {!panelOpen && (
                  <td className="px-4 py-3 text-right text-xs text-neutral-400">{formatLastActivity(row.lastActivity, t)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
