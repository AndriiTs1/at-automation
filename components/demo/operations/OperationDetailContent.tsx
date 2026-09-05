import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/dashboard/icons";
import { WORKFLOW_STEP_KEYS, type OperationActivityEntry, type OperationRow } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

type StepState = "completed" | "current" | "waiting" | "blocked" | "upcoming";

const STEP_DOT_CLASSES: Record<StepState, string> = {
  completed: "border-success bg-success text-white",
  current: "border-accent bg-accent text-white",
  waiting: "border-warning bg-warning text-white",
  blocked: "border-error bg-error text-white",
  upcoming: "border-border bg-surface text-neutral-300",
};

const STEP_LABEL_CLASSES: Record<StepState, string> = {
  completed: "text-foreground",
  current: "font-semibold text-foreground",
  waiting: "font-semibold text-foreground",
  blocked: "font-semibold text-foreground",
  upcoming: "text-neutral-400",
};

function getStepState(index: number, workflowStepIndex: number, status: OperationRow["status"]): StepState {
  if (status === "completed") return "completed";
  if (index < workflowStepIndex) return "completed";
  if (index > workflowStepIndex) return "upcoming";
  if (status === "inProgress") return "current";
  if (status === "waiting") return "waiting";
  return "blocked";
}

function ActivityLabel({ entry }: { entry: OperationActivityEntry }) {
  const tStage = useTranslations("Dashboard.Operations.stage");
  const tActivity = useTranslations("Dashboard.Operations.activity");
  const tAttentionNotes = useTranslations("Dashboard.Attention.notes");

  switch (entry.key) {
    case "received":
      return <>{tStage("orderReceived")}</>;
    case "inventoryReserved":
      return <>{tStage("inventoryReserved")}</>;
    case "supplierConfirmed":
      return <>{tStage("supplierConfirmed")}</>;
    case "paymentConfirmed":
      return <>{tStage("paymentReceived")}</>;
    case "customerNotified":
      return <>{tStage("customerNotified")}</>;
    case "supplierDelay":
      return <>{tAttentionNotes("supplierDelayDetected")}</>;
    case "invoiceGenerated":
      return <>{tActivity("invoiceGenerated", { invoice: entry.params?.invoice ?? "" })}</>;
    case "awaitingCustomer":
      return <>{tActivity("awaitingCustomer")}</>;
    default:
      return null;
  }
}

/**
 * Shared Operation detail body (header, overview, workflow, related information, activity).
 * Rendered inside a `flex flex-col` container that owns sizing/positioning — the desktop
 * 400px side panel and the mobile/tablet full-screen overlay both wrap this unchanged.
 */
export default function OperationDetailContent({
  operation,
  onClose,
}: {
  operation: OperationRow;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Operations");

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{operation.id}</p>
          <p className="mt-0.5 truncate text-sm text-neutral-500">{operation.customer}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[operation.status]}`}
          >
            {t(`status.${operation.status}`)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("detail.close")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-neutral-500">{t("table.value")}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{operation.value}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("table.owner")}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{operation.owner}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("detail.created")}</p>
            <p className="mt-0.5 text-sm text-neutral-600">{operation.created}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("table.updated")}</p>
            <p className="mt-0.5 text-sm text-neutral-600">{operation.updated}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.workflow")}</p>
          <div className="flex flex-col">
            {WORKFLOW_STEP_KEYS.map((key, index) => {
              const state = getStepState(index, operation.workflowStepIndex, operation.status);
              const isLast = index === WORKFLOW_STEP_KEYS.length - 1;
              const lineIsDone = state === "completed" && index < WORKFLOW_STEP_KEYS.length - 1;
              return (
                <div key={key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${STEP_DOT_CLASSES[state]}`}
                    >
                      {state === "completed" ? "✓" : ""}
                    </span>
                    {!isLast && <span className={`w-px flex-1 ${lineIsDone ? "bg-success/40" : "bg-border"}`} />}
                  </div>
                  <div className={`pb-4 text-sm ${STEP_LABEL_CLASSES[state]}`}>
                    {t(`stage.${key}`)}
                    {state === "current" && (
                      <span className="ml-1.5 text-xs font-medium text-accent">· {t("status.inProgress")}</span>
                    )}
                    {state === "waiting" && (
                      <span className="ml-1.5 text-xs font-medium text-warning">· {t("status.waiting")}</span>
                    )}
                    {state === "blocked" && (
                      <span className="ml-1.5 text-xs font-medium text-error">· {t("status.attention")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.customer")}</p>
          <p className="text-sm text-foreground">{operation.customer}</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.commercial")}</p>
            <p className="mt-1.5 text-sm text-foreground">
              {operation.invoice ? `${t("detail.invoice")} ${operation.invoice}` : t("detail.noInvoice")}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{t(`paymentStatus.${operation.paymentStatus}`)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.fulfilment")}</p>
            <p className="mt-1.5 text-sm text-foreground">{t(`inventoryStatus.${operation.inventoryStatus}`)}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("detail.activity")}</p>
          <div className="flex flex-col gap-1.5">
            {[...operation.activity].reverse().map((entry, index) => (
              <div key={`${entry.key}-${entry.time}-${index}`} className="flex gap-2 text-xs">
                <span className="shrink-0 font-mono text-neutral-400">{entry.time}</span>
                <span className="text-neutral-600">
                  <ActivityLabel entry={entry} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
