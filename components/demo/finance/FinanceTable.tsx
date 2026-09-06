import { useTranslations } from "next-intl";
import {
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceOutstanding,
  type FinanceInvoice,
} from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-600",
  sent: "bg-accent/10 text-accent",
  overdue: "bg-error/10 text-error",
  paid: "bg-success/10 text-success",
};

function formatUpdated(entry: FinanceInvoice["updated"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Explicit column-width percentages (table-layout: fixed) — Invoice, Customer, Status,
 * Operation, Issued, Due, Total, Outstanding, Updated. Fixed geometry from the start (rather
 * than table-layout: auto), matching Customers/Inventory's own proven approach so a future
 * filtering stage (2E.3) can't shift columns when the visible row count changes.
 *
 * Percentages are sized against MIN_TABLE_WIDTH from live-measured worst-case content across
 * all 6 locales (not guessed) — e.g. the invoice id "INV-2026-2001" (~95px), the longest
 * customer name "Harborline Logistics" (~136px), and the longest relative-time value
 * "Yesterday, 11:15" (en, ~88px) — each column keeps a ≥10px margin over its measured minimum
 * at 1190px. Invoice/Customer intentionally carry more width than Status/Operation/dates, per
 * the identity → customer → status business hierarchy.
 */
const MIN_TABLE_WIDTH = 1190;
const COLUMN_WIDTHS = ["12%", "16%", "12%", "9%", "9%", "11%", "9%", "11%", "11%"];

/**
 * Static, presentational Finance table (Stage 2E.1) — no row selection, no filtering, no
 * client state; rows are not interactive (no detail drawer until Stage 2E.2). Customer and
 * connected operation are resolved live via getFinanceCustomer/getFinanceOperation rather than
 * duplicated onto the invoice, and Outstanding is derived via getInvoiceOutstanding rather than
 * trusting a stored field, so neither can drift out of sync with total/paidAmount.
 */
export default function FinanceTable({ rows }: { rows: FinanceInvoice[] }) {
  const t = useTranslations("Dashboard.Finance");

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
            <th className="px-4 py-3 font-medium">{t("table.invoice")}</th>
            <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.status")}</th>
            <th className="px-4 py-3 text-center font-medium whitespace-nowrap">{t("table.operation")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.issued")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.due")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.total")}</th>
            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">{t("table.outstanding")}</th>
            <th className="px-4 py-3 text-right font-medium">{t("table.updated")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((invoice) => {
            const customer = getFinanceCustomer(invoice.customerId);
            const operation = getFinanceOperation(invoice.operationId);
            const outstanding = getInvoiceOutstanding(invoice);
            return (
              <tr key={invoice.id}>
                <td className="truncate px-4 py-3 font-semibold text-foreground">{invoice.id}</td>
                <td className="truncate px-4 py-3 text-neutral-600">{customer?.name ?? invoice.customerId}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[invoice.status]}`}
                  >
                    {t(`status.${invoice.status}`)}
                  </span>
                </td>
                <td className="truncate px-4 py-3 text-center text-neutral-500">{operation ? operation.id : "—"}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-500">{invoice.issueDate}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-500">{invoice.dueDate}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">
                  {formatChf(invoice.total)}
                </td>
                <td
                  className={`px-4 py-3 text-right whitespace-nowrap ${outstanding === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}
                >
                  {formatChf(outstanding)}
                </td>
                <td className="truncate px-4 py-3 text-right text-xs text-neutral-400">
                  {formatUpdated(invoice.updated, t)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
