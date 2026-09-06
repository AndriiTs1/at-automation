import { useTranslations } from "next-intl";
import {
  FINANCE_INVOICES,
  getOpenInvoiceCount,
  getOverdueOutstanding,
  getTotalOutstanding,
  getTotalPaid,
} from "@/lib/demo-data";
import FinanceTable from "./FinanceTable";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/**
 * Desktop-only Finance workspace foundation (Stage 2E.1). Hidden below the @5xl container-query
 * breakpoint, matching CustomersDesktop/InventoryDesktop/OperationsDesktop's own threshold.
 * Deliberately minimal: header, KPIs and a static table — no toolbar (no filters exist yet,
 * Stage 2E.3), no row selection, no detail overlay (Stage 2E.2). KPIs are computed from
 * FINANCE_INVOICES itself via lib/demo-data.ts helpers rather than a separate hardcoded
 * summary, so they can never drift out of sync with the row data.
 */
export default function FinanceDesktop() {
  const t = useTranslations("Dashboard.Finance");

  const summaryItems = [
    { key: "outstanding", value: formatChf(getTotalOutstanding()), tone: "accent" },
    { key: "overdue", value: formatChf(getOverdueOutstanding()), tone: "error" },
    { key: "openInvoices", value: String(getOpenInvoiceCount()), tone: "accent" },
    { key: "paid", value: formatChf(getTotalPaid()), tone: "success" },
  ] as const;

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header */}
      <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          {t("newInvoice")}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <FinanceTable rows={FINANCE_INVOICES} />
    </div>
  );
}
