"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { OPERATIONS_ROWS } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

export default function OperationsTable({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("Dashboard.Operations");

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
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
          {OPERATIONS_ROWS.map((row) => {
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
          })}
        </tbody>
      </table>
    </div>
  );
}
