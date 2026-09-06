import { useTranslations } from "next-intl";
import { getFiduciaryHandoffStatus, getFinanceReconciliationOverview, getFinanceVatOverview } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const HANDOFF_TONE: Record<"ready" | "needsAttention", string> = {
  ready: "bg-success/10 text-success",
  needsAttention: "bg-warning/10 text-warning",
};

/**
 * Compact Finance Operations panel (Stage 2E.6) — VAT overview, Reconciliation overview, and
 * Fiduciary/accountant handoff readiness in one small 3-column section, shared by desktop,
 * tablet, and mobile (rendered from FinanceDesktop and from FinanceWorkspace's mobile/tablet
 * branches, immediately after FinanceCashFlowSummary) so this business logic exists in exactly
 * one place. Every value reads a global lib/demo-data.ts helper directly — never
 * filteredInvoices — so, like the KPI row and Cash Flow, it never reacts to the active
 * search/filter state.
 *
 * Unconditional grid-cols-3 (no responsive column-count change) mirrors FinanceCashFlowSummary
 * exactly: 3 narrow columns already proved to fit down to 360px without truncating money values,
 * and keeps this section short instead of stacking to a tall single column on mobile.
 */
export default function FinanceOperationsSummary() {
  const t = useTranslations("Dashboard.Finance");
  const vat = getFinanceVatOverview();
  const reconciliation = getFinanceReconciliationOverview();
  const handoff = getFiduciaryHandoffStatus();

  return (
    <div className="mb-4 shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {t("financeOperations.title")}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* VAT overview — invoice-level visibility only, never an official VAT return/liability.
            Nothing here truncates: labels/amounts wrap instead, since a compound-word locale
            (e.g. German "MWST", Russian "НДС") can't always be shortened further. */}
        <div className="min-w-0">
          <p className="break-words text-xs text-neutral-500">{t("financeOperations.vatRepresented")}</p>
          <p className="mt-0.5 text-base leading-tight font-bold break-words text-foreground">
            {formatChf(vat.vatAmount)}
          </p>
          <p className="break-words text-xs text-neutral-400">
            {vat.rate}% · {t("toolbar.resultCount", { count: vat.invoiceCount })}
          </p>
        </div>

        {/* Reconciliation overview — Draft excluded, same rule as the Finance filters. */}
        <div className="min-w-0">
          <p className="break-words text-xs text-neutral-500">{t("detail.reconciliation")}</p>
          <p
            className={`mt-0.5 text-sm leading-tight font-bold break-words ${
              reconciliation.exception > 0 ? "text-warning" : "text-neutral-400"
            }`}
          >
            {t("financeOperations.awaitingReview", { count: reconciliation.exception })}
          </p>
          {/* Never truncate — wrap instead, same rule as the money values above. */}
          <p className="break-words text-xs text-neutral-400">
            {reconciliation.reconciled} {t("detail.reconciliationState.reconciled")} ·{" "}
            {reconciliation.pending} {t("detail.reconciliationState.pending")}
          </p>
        </div>

        {/* Fiduciary/accountant handoff — deterministic demo readiness, no real integration. */}
        <div className="min-w-0">
          <p className="break-words text-xs text-neutral-500">{t("financeOperations.fiduciaryHandoff")}</p>
          <span
            className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${HANDOFF_TONE[handoff.status]}`}
          >
            {t(handoff.status === "ready" ? "financeOperations.handoffReady" : "financeOperations.handoffNeedsAttention")}
          </span>
          {/* The reason when attention is needed; the plain issued-invoice count once ready —
              never both crammed onto one line, and never truncated. */}
          <p className="mt-1 break-words text-xs text-neutral-400">
            {handoff.status === "needsAttention"
              ? t("financeOperations.exceptionCount", { count: handoff.exceptionCount })
              : t("toolbar.resultCount", { count: handoff.issuedInvoiceCount })}
          </p>
        </div>
      </div>
    </div>
  );
}
