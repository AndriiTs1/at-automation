import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/dashboard/icons";
import { ActivityLabel } from "@/components/demo/operations/OperationDetailContent";
import { getCustomerActivity, getOperationsForCustomer, type CustomerRow } from "@/lib/demo-data";

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

const OPERATION_STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

/**
 * Shared Customer detail body (header, account overview, health, related operations,
 * commercial, recent activity). Related operations and activity are derived live from
 * OPERATIONS_ROWS via customerId — CUSTOMERS_ROWS never duplicates operation data.
 */
export default function CustomerDetailContent({
  customer,
  onClose,
}: {
  customer: CustomerRow;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Customers");
  const tOps = useTranslations("Dashboard.Operations");

  const relatedOperations = getOperationsForCustomer(customer.id);
  const recentActivity = getCustomerActivity(customer.id);
  const hasOutstanding = customer.outstanding !== "CHF 0";

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{customer.name}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{customer.id}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${HEALTH_TONE[customer.health]}`}
            >
              {t(`health.${customer.health}`)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${SEGMENT_TONE[customer.segment]}`}
            >
              {t(`segment.${customer.segment}`)}
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
        {/* Account overview */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.accountOverview")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("table.owner")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{customer.owner}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.openOperations")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{customer.openOperations}</p>
            </div>
          </div>
        </div>

        {/* Account health */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.accountHealth")}
          </p>
          <p className="text-sm text-neutral-600">{t(`detail.healthNote.${customer.health}`)}</p>
        </div>

        {/* Related operations */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.relatedOperations")}
          </p>
          {relatedOperations.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noOperations")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {relatedOperations.map((operation) => (
                <div key={operation.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{operation.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OPERATION_STATUS_TONE[operation.status]}`}
                      >
                        {tOps(`status.${operation.status}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">{tOps(`stage.${operation.stage}`)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground">{operation.value}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {tOps("table.updated")} {operation.updated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commercial */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.commercial")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("table.revenue")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{customer.revenue}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.outstanding")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{customer.outstanding}</p>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            {hasOutstanding ? t("detail.balanceOutstanding") : t("detail.balanceClear")}
          </p>
        </div>

        {/* Recent activity */}
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.recentActivity")}
          </p>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noActivity")}</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {recentActivity.map((entry, index) => (
                <div key={`${entry.operationId}-${entry.key}-${entry.time}-${index}`} className="flex gap-2 text-xs">
                  <span className="shrink-0 font-mono text-neutral-400">{entry.time}</span>
                  <span className="text-neutral-600">
                    <span className="font-medium text-neutral-500">{entry.operationId}</span>{" "}
                    <ActivityLabel entry={entry} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
