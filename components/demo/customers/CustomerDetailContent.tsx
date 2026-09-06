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
 *
 * `variant` lets the mobile/tablet full-screen overlay (CustomerDetailMobile) use a more
 * generously spaced, "activity feed" treatment of Recent Activity without touching the
 * desktop drawer's (CustomerDetailPanel's) rendering — the default "desktop" variant is
 * byte-identical to this component's pre-Stage-2C.4-mobile-polish output.
 */
export default function CustomerDetailContent({
  customer,
  onClose,
  variant = "desktop",
}: {
  customer: CustomerRow;
  onClose: () => void;
  variant?: "desktop" | "mobile";
}) {
  const t = useTranslations("Dashboard.Customers");
  const tOps = useTranslations("Dashboard.Operations");

  const relatedOperations = getOperationsForCustomer(customer.id);
  const recentActivity = getCustomerActivity(customer.id);
  const hasOutstanding = customer.outstanding !== "CHF 0";
  const isMobile = variant === "mobile";

  return (
    <>
      <div
        className={`flex shrink-0 items-start justify-between gap-3 border-b border-border ${isMobile ? "p-4" : "p-3.5"}`}
      >
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{customer.name}</p>
          <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-xs text-neutral-400`}>{customer.id}</p>
          <div className={`${isMobile ? "mt-2" : "mt-1.5"} flex flex-wrap items-center gap-1.5`}>
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

      <div className={`min-h-0 flex-1 overflow-y-auto ${isMobile ? "p-4" : "p-3.5"}`}>
        {/* Account overview */}
        <div className={isMobile ? "mb-6" : "mb-4"}>
          <p className={`${isMobile ? "mb-2" : "mb-1.5"} text-xs font-semibold tracking-wide text-neutral-500 uppercase`}>
            {t("detail.accountOverview")}
          </p>
          <div className={`grid grid-cols-2 ${isMobile ? "gap-4" : "gap-3"}`}>
            <div>
              <p className="text-xs text-neutral-500">{t("table.owner")}</p>
              <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-sm font-semibold text-foreground`}>{customer.owner}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.openOperations")}</p>
              <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-sm font-semibold text-foreground`}>
                {customer.openOperations}
              </p>
            </div>
          </div>
        </div>

        {/* Account health */}
        <div className={isMobile ? "mb-6" : "mb-4"}>
          <p className={`${isMobile ? "mb-2" : "mb-1.5"} text-xs font-semibold tracking-wide text-neutral-500 uppercase`}>
            {t("detail.accountHealth")}
          </p>
          <p className="text-sm text-neutral-600">{t(`detail.healthNote.${customer.health}`)}</p>
        </div>

        {/* Related operations */}
        <div className={isMobile ? "mb-7" : "mb-4"}>
          <p className={`${isMobile ? "mb-2" : "mb-1.5"} text-xs font-semibold tracking-wide text-neutral-500 uppercase`}>
            {t("detail.relatedOperations")}
          </p>
          {relatedOperations.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noOperations")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {relatedOperations.map((operation) => (
                <div
                  key={operation.id}
                  className={`flex items-center justify-between gap-3 px-3 ${isMobile ? "py-2.5" : "py-2"}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{operation.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OPERATION_STATUS_TONE[operation.status]}`}
                      >
                        {tOps(`status.${operation.status}`)}
                      </span>
                    </div>
                    <p className={`${isMobile ? "mt-1" : "mt-0.5"} truncate text-xs text-neutral-500`}>
                      {tOps(`stage.${operation.stage}`)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground">{operation.value}</p>
                    <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-xs text-neutral-400`}>
                      {tOps("table.updated")} {operation.updated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commercial */}
        <div className={isMobile ? "mb-6" : "mb-4"}>
          <p className={`${isMobile ? "mb-2" : "mb-1.5"} text-xs font-semibold tracking-wide text-neutral-500 uppercase`}>
            {t("detail.commercial")}
          </p>
          <div className={`grid grid-cols-2 ${isMobile ? "gap-4" : "gap-3"}`}>
            <div>
              <p className="text-xs text-neutral-500">{t("table.revenue")}</p>
              <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-sm font-semibold text-foreground`}>{customer.revenue}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.outstanding")}</p>
              <p className={`${isMobile ? "mt-1" : "mt-0.5"} text-sm font-semibold text-foreground`}>
                {customer.outstanding}
              </p>
            </div>
          </div>
          <p className={`${isMobile ? "mt-2" : "mt-1.5"} text-xs text-neutral-500`}>
            {hasOutstanding ? t("detail.balanceOutstanding") : t("detail.balanceClear")}
          </p>
        </div>

        {/* Recent activity — mobile/tablet gets a restrained "activity feed" treatment
            (description as the primary readable text, time secondary, subtle row dividers)
            instead of desktop's compact monospace-time log line. */}
        <div>
          <p className={`${isMobile ? "mb-2" : "mb-1.5"} text-xs font-semibold tracking-wide text-neutral-500 uppercase`}>
            {t("detail.recentActivity")}
          </p>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noActivity")}</p>
          ) : isMobile ? (
            <div className="flex flex-col">
              {recentActivity.map((entry, index) => (
                <div
                  key={`${entry.operationId}-${entry.key}-${entry.time}-${index}`}
                  className={`flex items-baseline justify-between gap-3 py-2 ${index === 0 ? "" : "border-t border-border/60"}`}
                >
                  <p className="min-w-0 flex-1 text-sm text-neutral-700">
                    <span className="font-medium text-neutral-500">{entry.operationId}</span>{" "}
                    <ActivityLabel entry={entry} />
                  </p>
                  <span className="shrink-0 text-xs text-neutral-400">{entry.time}</span>
                </div>
              ))}
            </div>
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
