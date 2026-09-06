import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/dashboard/icons";
import {
  getFinanceCustomer,
  getFinanceOperation,
  getInvoiceActivity,
  getInvoiceOutstanding,
  getInvoiceReconciliationState,
  type FinanceInvoice,
} from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-600",
  sent: "bg-accent/10 text-accent",
  overdue: "bg-error/10 text-error",
  paid: "bg-success/10 text-success",
};

const RECONCILIATION_TONE: Record<string, string> = {
  reconciled: "bg-success/10 text-success",
  pending: "bg-neutral-200 text-neutral-600",
  exception: "bg-warning/10 text-warning",
};

const OPERATION_STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Which explanatory note to show under Payment status. An unmatched/reversed payment (reconciliationState
 * === "exception") takes priority over the invoice's own status since it's the most actionable
 * fact; a draft is never described as overdue/open (see Stage 2E.2's explicit Draft-safety rule).
 */
function getPaymentNoteKey(
  invoice: FinanceInvoice,
  reconciliationState: ReturnType<typeof getInvoiceReconciliationState>,
): "draft" | "needsReview" | "paidInFull" | "partial" | "overdue" | "open" {
  if (invoice.status === "draft") return "draft";
  if (reconciliationState === "exception") return "needsReview";
  if (invoice.status === "paid") return "paidInFull";
  if (invoice.paidAmount > 0) return "partial";
  if (invoice.status === "overdue") return "overdue";
  return "open";
}

/**
 * Shared Finance Detail body (Stage 2E.2): header, invoice overview, amounts/VAT, payment
 * status/reconciliation, connected operation, payment activity. Customer and connected operation
 * are resolved live via getFinanceCustomer/getFinanceOperation — never duplicated onto the
 * invoice — and outstanding/reconciliation/activity are all derived (getInvoiceOutstanding/
 * getInvoiceReconciliationState/getInvoiceActivity) rather than stored, so none of them can drift
 * out of sync with the invoice's own total/paidAmount/payments.
 *
 * A draft invoice hasn't been issued yet and isn't a receivable: its Amounts section omits
 * Paid/Outstanding entirely (showing them would visually imply an open balance), its Payment
 * status section skips the reconciliation badge, and Payment activity is hidden rather than
 * showing an empty "Invoice issued" entry for an invoice that hasn't actually been issued.
 */
export default function FinanceDetailContent({
  invoice,
  onClose,
}: {
  invoice: FinanceInvoice;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Finance");
  const tOps = useTranslations("Dashboard.Operations");

  const customer = getFinanceCustomer(invoice.customerId);
  const operation = getFinanceOperation(invoice.operationId);
  const outstanding = getInvoiceOutstanding(invoice);
  const reconciliationState = getInvoiceReconciliationState(invoice.id);
  const activity = getInvoiceActivity(invoice.id);
  const isDraft = invoice.status === "draft";
  const noteKey = getPaymentNoteKey(invoice, reconciliationState);

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{invoice.id}</p>
          <p className="mt-0.5 truncate text-xs text-neutral-400">
            {customer?.name ?? invoice.customerId}
            {operation ? ` · ${operation.id}` : ""}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[invoice.status]}`}
            >
              {t(`status.${invoice.status}`)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("detail.close")}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
        {/* Invoice overview */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.invoiceOverview")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("table.issued")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.due")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{invoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Amounts */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.amounts")}</p>
          <div className="flex flex-col gap-1.5 rounded-lg border border-border px-3 py-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">{t("detail.subtotal")}</span>
              <span className="text-foreground">{formatChf(invoice.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">{t("detail.vat", { rate: invoice.vatRate })}</span>
              <span className="text-foreground">{formatChf(invoice.vatAmount)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-1.5 text-sm font-semibold">
              <span className="text-foreground">{t("table.total")}</span>
              <span className="text-foreground">{formatChf(invoice.total)}</span>
            </div>
            {!isDraft && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{t("summary.paid")}</span>
                  <span className="text-success">{formatChf(invoice.paidAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground">{t("table.outstanding")}</span>
                  <span className={outstanding === 0 ? "text-neutral-400" : "text-accent"}>
                    {formatChf(outstanding)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment status */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.paymentStatus")}
          </p>
          {!isDraft && (
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-neutral-500">{t("detail.reconciliation")}</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${RECONCILIATION_TONE[reconciliationState]}`}
              >
                {t(`detail.reconciliationState.${reconciliationState}`)}
              </span>
            </div>
          )}
          <p className="text-sm text-neutral-600">
            {noteKey === "overdue" ? t("detail.note.overdue", { date: invoice.dueDate }) : t(`detail.note.${noteKey}`)}
          </p>
        </div>

        {/* Connected operation */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.connectedOperation")}
          </p>
          {operation ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{operation.id}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OPERATION_STATUS_TONE[operation.status]}`}
                  >
                    {tOps(`status.${operation.status}`)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-neutral-500">{operation.customer}</p>
                <p className="truncate text-xs text-neutral-400">{tOps(`stage.${operation.stage}`)}</p>
              </div>
              <p className="shrink-0 text-sm font-medium text-foreground">{operation.value}</p>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">{t("detail.noConnectedOperation")}</p>
          )}
        </div>

        {/* Payment activity */}
        {activity.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              {t("detail.paymentActivity")}
            </p>
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {activity.map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="text-neutral-600">{t(`detail.activity.${entry.key}`, entry.params)}</span>
                  <span className="shrink-0 text-xs text-neutral-400">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
