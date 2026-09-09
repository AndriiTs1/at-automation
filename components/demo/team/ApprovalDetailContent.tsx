import { useTranslations } from "next-intl";
import { APPROVALS, getTeamMember } from "@/lib/demo-data";
import { formatWaitingSince } from "./teamFormatters";

export type ApprovalItem = (typeof APPROVALS)[number];

/** Local-only decision state — never written back to APPROVALS (see ApprovalDetailContent's own
 * module doc and TeamWorkspace's decisions state). "pending" here means "not yet decided on this
 * page" and is independent of the (always-"pending") `status` field the data itself carries. */
export type ApprovalDecision = "pending" | "approved" | "rejected";

/** Restrained enterprise status treatment — the same small colored dot + plain text language
 * IntegrationsDesktop's table established, replacing the old rounded accent pill this page used
 * to show for every approval regardless of outcome. Exported so TeamDesktop/TeamWorkspace/
 * TeamApprovalsMobileList can render the identical dot without duplicating this color map three
 * times. */
export const APPROVAL_STATUS_DOT_TONE: Record<ApprovalDecision, string> = {
  pending: "bg-accent",
  approved: "bg-success",
  rejected: "bg-error",
};

export const APPROVAL_STATUS_TEXT_TONE: Record<ApprovalDecision, string> = {
  pending: "text-neutral-600",
  approved: "text-foreground",
  rejected: "text-foreground",
};

function roleLabelFor(
  role: string,
  t: ReturnType<typeof useTranslations>,
  tDashboard: ReturnType<typeof useTranslations>,
) {
  return role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`);
}

/**
 * Desktop/mobile-shared inspector header — composed into DetailInspectorShell's `header` slot by
 * both ApprovalDetailPanel (desktop) and ApprovalDetailMobile. Mirrors AutomationInspectorHeader/
 * IntegrationInspectorHeader's plain-text status line, plus the small semantic dot.
 */
export function ApprovalInspectorHeader({ approval, decision }: { approval: ApprovalItem; decision: ApprovalDecision }) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <>
      <p className="truncate text-lg font-semibold text-foreground">{tApprovals(`items.${approval.key}`)}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${APPROVAL_STATUS_DOT_TONE[decision]}`} />
        <p className={`text-xs ${APPROVAL_STATUS_TEXT_TONE[decision]}`}>
          {t(`approvals.status.${decision}`)} · {tTeams(approval.deptKey)}
        </p>
      </div>
    </>
  );
}

/**
 * Desktop/mobile-shared inspector body — composed into DetailInspectorShell's `children` slot.
 * Uses ONLY facts already available from APPROVALS + TEAM_MEMBERS (value, requester, approver,
 * waiting-since) — no invented notes, reasons, line items, or related-object links, since
 * APPROVALS carries none. Approve/Reject call back into TeamWorkspace's local decisions state;
 * this component never mutates APPROVALS itself.
 */
export function ApprovalInspectorBody({
  approval,
  decision,
  onApprove,
  onReject,
}: {
  approval: ApprovalItem;
  decision: ApprovalDecision;
  onApprove: () => void;
  onReject: () => void;
}) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tAutomations = useTranslations("Dashboard.Automations");

  const requestedBy = getTeamMember(approval.requestedByMemberId);
  const approver = getTeamMember(approval.approverMemberId);

  return (
    <>
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("approvals.columns.value")}</p>
        <p className="text-sm font-semibold break-words text-foreground">{approval.amount}</p>
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          {t("approvals.columns.requestedBy")}
        </p>
        <p className="text-sm break-words text-foreground">{requestedBy?.name ?? ""}</p>
        {requestedBy && (
          <p className="mt-0.5 text-xs break-words text-neutral-500">{roleLabelFor(requestedBy.role, t, tDashboard)}</p>
        )}
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("approvals.columns.approver")}</p>
        <p className="text-sm break-words text-foreground">{approver?.name ?? ""}</p>
        {approver && <p className="mt-0.5 text-xs break-words text-neutral-500">{roleLabelFor(approver.role, t, tDashboard)}</p>}
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          {t("approvals.columns.waitingSince")}
        </p>
        <p className="text-sm break-words text-foreground">{formatWaitingSince(approval.waitingSince, tAutomations)}</p>
      </div>

      <div>
        {decision === "pending" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onApprove}
              className="flex-1 rounded-full bg-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-success/90"
            >
              {t("detail.approve")}
            </button>
            <button
              type="button"
              onClick={onReject}
              className="flex-1 rounded-full border border-error/30 px-4 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error/10"
            >
              {t("detail.reject")}
            </button>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">{t(`detail.decided.${decision}`)}</p>
        )}
      </div>
    </>
  );
}
