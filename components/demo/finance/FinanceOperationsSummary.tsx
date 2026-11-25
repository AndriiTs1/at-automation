import { useTranslations } from "next-intl";
import { getFiduciaryHandoffStatus, getFinanceReconciliationOverview, getFinanceVatOverview } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const HANDOFF_TONE: Record<"ready" | "needsAttention", string> = {
  ready: "bg-success/10 text-success",
  needsAttention: "bg-warning/10 text-warning",
};

function FinanceIcon({ type }: { type: "vat" | "reconciliation" | "handoff" }) {
  const paths = {
    vat: "M6 3h12v18l-3-2-3 2-3-2-3 2V3z M9 8h6 M9 12h6 M9 16h3",
    reconciliation: "M9 6h11 M9 12h11 M9 18h11 M3 6l1 1 2-2 M3 12l1 1 2-2 M3 18l1 1 2-2",
    handoff: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z M9 12l2 2 4-4",
  };

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3c587d]/8 text-[#3c587d]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d={paths[type]} />
      </svg>
    </span>
  );
}

/** Global demo finance overview, independent of active invoice filters. */
export default function FinanceOperationsSummary() {
  const t = useTranslations("Dashboard.Finance");
  const vat = getFinanceVatOverview();
  const reconciliation = getFinanceReconciliationOverview();
  const handoff = getFiduciaryHandoffStatus();

  return (
    <div className="shrink-0 rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {t("financeOperations.title")}
        </h2>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-[#3c587d]"
          aria-hidden="true"
        >
          <path d="M3 9l9-6 9 6H3z M5 11v7 M10 11v7 M14 11v7 M19 11v7 M3 21h18" />
        </svg>
      </div>

      <div className="mt-3 flex flex-col divide-y divide-border">

        <div className="flex min-w-0 items-center gap-2.5 py-3">
          <FinanceIcon type="vat" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground">
              {t("financeOperations.vatRepresented")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {vat.rate}% · {t("toolbar.resultCount", { count: vat.invoiceCount })}
            </p>
          </div>
          <p className="text-right text-sm font-semibold text-foreground tabular-nums">
            {formatChf(vat.vatAmount)}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 py-3">
          <FinanceIcon type="reconciliation" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground">
              {t("detail.reconciliation")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {reconciliation.reconciled} {t("detail.reconciliationState.reconciled")} ·{" "}
              {reconciliation.pending} {t("detail.reconciliationState.pending")}
            </p>
          </div>
          <p className={`max-w-[40%] text-right text-xs font-medium ${
            reconciliation.exception > 0 ? "text-warning" : "text-neutral-500"
          }`}>
            {t("financeOperations.awaitingReview", { count: reconciliation.exception })}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 pt-3">
          <FinanceIcon type="handoff" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground">
              {t("financeOperations.fiduciaryHandoff")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {handoff.status === "needsAttention"
                ? t("financeOperations.exceptionCount", { count: handoff.exceptionCount })
                : t("toolbar.resultCount", { count: handoff.issuedInvoiceCount })}
            </p>
          </div>
          <span className={`max-w-[40%] rounded-lg px-2 py-1 text-center text-xs font-medium ${HANDOFF_TONE[handoff.status]}`}>
            {t(handoff.status === "ready"
              ? "financeOperations.handoffReady"
              : "financeOperations.handoffNeedsAttention")}
          </span>
        </div>

      </div>
    </div>
  );
}
