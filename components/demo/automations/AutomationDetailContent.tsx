import { useTranslations } from "next-intl";
import {
  APPROVALS,
  CUSTOMERS_ROWS,
  FINANCE_INVOICES,
  INVENTORY_ROWS,
  getAutomationRuns,
  getAutomationWorkflowSteps,
  getFinanceCustomer,
  getFinanceOperation,
  getOverdueCount,
  getOverdueOutstanding,
  getReservationsForItem,
  type AutomationDefinition,
} from "@/lib/demo-data";
import { CloseIcon } from "@/components/dashboard/icons";
import { formatAutomationTimestamp, getAutomationRunEntityLabel } from "./automationFormatters";

const STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-neutral-200 text-neutral-600",
  needsAttention: "bg-warning/10 text-warning",
};

const STEP_DOT_TONE: Record<string, string> = {
  completed: "bg-success",
  attention: "bg-warning",
  pending: "bg-neutral-300",
};

const STEP_TEXT_TONE: Record<string, string> = {
  completed: "text-neutral-400",
  attention: "font-medium text-warning",
  pending: "text-neutral-400",
};

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

/**
 * Resolves the small set of related-business-context facts for one automation. Every value is
 * read live from the authoritative module data (FINANCE_INVOICES, INVENTORY_ROWS, CUSTOMERS_ROWS,
 * APPROVALS, getOverdueCount/getOverdueOutstanding) — the automation only stores the id
 * reference (relatedEntityIds) or nothing at all, never a duplicated fact. Returns an empty array
 * when nothing meaningful applies (fiduciaryHandoff) rather than inventing a fact to fill space.
 */
function getRelatedFacts(
  automation: AutomationDefinition,
  t: ReturnType<typeof useTranslations>,
  tFinance: ReturnType<typeof useTranslations>,
): { label: string; value: string }[] {
  switch (automation.key) {
    case "overdueInvoiceFollowUp":
      return [
        { label: t("relatedLabels.overdueInvoiceCount"), value: String(getOverdueCount()) },
        { label: tFinance("summary.overdue"), value: formatChf(getOverdueOutstanding()) },
      ];
    case "paymentReconciliation": {
      const invoiceId = automation.relatedEntityIds?.[0];
      const invoice = FINANCE_INVOICES.find((candidate) => candidate.id === invoiceId);
      if (!invoice) return [];
      const customer = getFinanceCustomer(invoice.customerId);
      return [
        { label: tFinance("table.invoice"), value: invoice.id },
        { label: tFinance("table.customer"), value: customer?.name ?? invoice.customerId },
        { label: tFinance("table.total"), value: formatChf(invoice.total) },
      ];
    }
    case "lowStockReplenishment": {
      const itemId = automation.relatedEntityIds?.[0];
      const item = INVENTORY_ROWS.find((candidate) => candidate.id === itemId);
      if (!item) return [];
      const reservation = getReservationsForItem(item.id)[0];
      const facts = [{ label: t("relatedLabels.inventoryItem"), value: item.name }];
      if (reservation) {
        facts.push(
          { label: tFinance("table.operation"), value: reservation.operation.id },
          { label: tFinance("table.customer"), value: reservation.operation.customer },
        );
      }
      return facts;
    }
    case "operationToInvoice": {
      const operationId = automation.relatedEntityIds?.[0];
      const operation = getFinanceOperation(operationId ?? null);
      if (!operation) return [];
      const connectedInvoice = FINANCE_INVOICES.find((invoice) => invoice.operationId === operation.id);
      const facts = [
        { label: tFinance("table.operation"), value: operation.id },
        { label: tFinance("table.customer"), value: operation.customer },
      ];
      if (connectedInvoice) facts.push({ label: tFinance("table.invoice"), value: connectedInvoice.id });
      return facts;
    }
    case "customerFollowUp": {
      const customerId = automation.relatedEntityIds?.[0];
      const customer = CUSTOMERS_ROWS.find((candidate) => candidate.id === customerId);
      if (!customer) return [];
      return [
        { label: tFinance("table.customer"), value: customer.name },
        { label: tFinance("table.outstanding"), value: customer.outstanding },
      ];
    }
    case "approvalRouting":
      return [{ label: t("relatedLabels.awaitingApproval"), value: String(APPROVALS.length) }];
    default:
      return [];
  }
}

/**
 * Shared Automation Detail body (Stage 2F.2) — header, trigger, workflow timeline, current
 * outcome, related business context, and recent executions. Deliberately free of any
 * desktop-specific positioning (no `absolute`/fixed width) so it can be reused unchanged inside
 * AutomationDetailMobile in a later stage, exactly as InventoryDetailContent/FinanceDetailContent
 * are shared between their own desktop panel and mobile overlay.
 */
export default function AutomationDetailContent({
  automation,
  onClose,
}: {
  automation: AutomationDefinition;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Automations");
  const tFinance = useTranslations("Dashboard.Finance");
  const tApprovals = useTranslations("Dashboard.Approvals");

  const workflowSteps = [
    { id: "trigger", label: t(`definitions.${automation.key}.trigger`), status: "completed" as const },
    ...getAutomationWorkflowSteps(automation.key).map((step) => ({
      id: step.id,
      label: t(`workflowSteps.${step.labelKey}`),
      status: step.status,
    })),
  ];

  const outcomeParams = automation.key === "overdueInvoiceFollowUp" ? { count: getOverdueCount() } : undefined;
  const relatedFacts = getRelatedFacts(automation, t, tFinance);
  const runs = getAutomationRuns(automation.id);

  const stepStatusLabel = (status: string) =>
    status === "completed" ? t("runStatus.completed") : status === "attention" ? t("status.needsAttention") : t("workflowStepStatus.pending");

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{t(`definitions.${automation.key}.name`)}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[automation.status]}`}
            >
              {t(`status.${automation.status}`)}
            </span>
            <span className="text-xs text-neutral-500">{t(`category.${automation.category}`)}</span>
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
        {/* Trigger */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.trigger")}</p>
          <p className="text-sm break-words text-foreground">{t(`definitions.${automation.key}.trigger`)}</p>
        </div>

        {/* Workflow */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.workflow")}</p>
          <div className="flex flex-col">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative flex gap-3 pb-3.5 last:pb-0">
                {index < workflowSteps.length - 1 && (
                  <span className="absolute top-3 left-[4.5px] h-full w-px bg-border" aria-hidden="true" />
                )}
                <span
                  className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STEP_DOT_TONE[step.status]}`}
                  aria-hidden="true"
                />
                <p className="min-w-0 flex-1 text-sm break-words text-foreground">{step.label}</p>
                <span className={`shrink-0 text-xs whitespace-nowrap ${STEP_TEXT_TONE[step.status]}`}>
                  {stepStatusLabel(step.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current outcome */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.currentOutcome")}
          </p>
          <p className="text-sm break-words text-foreground">{t(`currentOutcome.${automation.key}`, outcomeParams)}</p>
        </div>

        {/* Related business context */}
        {relatedFacts.length > 0 && (
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.related")}</p>
            <div className="grid grid-cols-2 gap-3">
              {relatedFacts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <p className="break-words text-xs text-neutral-500">{fact.label}</p>
                  <p className="mt-0.5 text-sm font-semibold break-words text-foreground">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent executions */}
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.recentExecutions")}
          </p>
          {runs.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noRecentExecutions")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {runs.map((run) => {
                const entityLabel = getAutomationRunEntityLabel(run, tApprovals);
                return (
                  <div key={run.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <div className="min-w-0">
                      {entityLabel && <p className="break-words text-sm text-foreground">{entityLabel}</p>}
                      <span
                        className={`text-xs ${run.status === "attention" ? "font-medium text-warning" : "text-neutral-500"}`}
                      >
                        {run.status === "attention" ? t("status.needsAttention") : t("runStatus.completed")}
                      </span>
                    </div>
                    <p className="shrink-0 text-xs whitespace-nowrap text-neutral-400">
                      {formatAutomationTimestamp(run.timestamp, t)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
