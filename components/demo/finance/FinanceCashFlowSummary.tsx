import { useTranslations } from "next-intl";
import { getReceivablesAging } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const BUCKETS = [
  { key: "overdue", labelKey: "summary.overdue", tone: "text-error" },
  { key: "dueSoon", labelKey: "cashFlow.dueSoon", tone: "text-warning" },
  { key: "dueLater", labelKey: "cashFlow.dueLater", tone: "text-foreground" },
] as const;

/**
 * Compact Cash Flow / Receivables Aging summary (Stage 2E.5) — one small text-only section
 * shared by desktop, tablet, and mobile (rendered from FinanceDesktop and from FinanceWorkspace's
 * mobile/tablet branches) so the aging logic and its presentation exist in exactly one place.
 * Reads getReceivablesAging() directly, the same way FinanceDesktop's own KPI row reads
 * getTotalOutstanding() etc. directly — a GLOBAL figure, never passed filteredInvoices, so it can
 * never react to the active search/filter state. The three bucket amounts always sum to the
 * Outstanding KPI exactly (both are derived from the same RECEIVABLE_STATUSES invoices).
 */
export default function FinanceCashFlowSummary() {
  const t = useTranslations("Dashboard.Finance");
  const aging = getReceivablesAging();

  return (
    <div className="mb-4 shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {t("cashFlow.title")}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {BUCKETS.map((bucket) => {
          const data = aging[bucket.key];
          return (
            <div key={bucket.key} className="min-w-0">
              <p className="truncate text-xs text-neutral-500">{t(bucket.labelKey)}</p>
              {/* Never truncate a money value — wrap instead if a locale's amount needs it. */}
              <p className={`mt-0.5 text-base leading-tight font-bold break-words ${bucket.tone}`}>
                {formatChf(data.amount)}
              </p>
              <p className="truncate text-xs text-neutral-400">{t("toolbar.resultCount", { count: data.count })}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
