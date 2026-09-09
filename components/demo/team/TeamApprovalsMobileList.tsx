import { useTranslations } from "next-intl";
import { APPROVALS, getTeamMember } from "@/lib/demo-data";
import { APPROVAL_STATUS_DOT_TONE, APPROVAL_STATUS_TEXT_TONE, type ApprovalDecision } from "./ApprovalDetailContent";
import { formatWaitingSince } from "./teamFormatters";

/**
 * Dense stacked approval card list for mobile and tablet — reuses APPROVALS/getTeamMember
 * directly, the same single approvals list the desktop table and Command Center's ApprovalsPanel
 * already read. Cards are now clickable (mirrors IntegrationsMobileList's button-per-card
 * pattern) — the only interactive change on this page; TeamMembersMobileList stays untouched and
 * non-interactive. `decisions` is page-local state owned by TeamWorkspace, never written back to
 * APPROVALS — a decided card stays in place, subtly deprioritized (no strikethrough), and stays
 * clickable so its detail can be reopened.
 */
export default function TeamApprovalsMobileList({
  selectedId,
  onSelect,
  decisions,
}: {
  selectedId: string | null;
  onSelect: (key: string) => void;
  decisions: Record<string, ApprovalDecision>;
}) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <ul className="flex flex-col gap-2">
      {APPROVALS.map((approval) => {
        const requestedBy = getTeamMember(approval.requestedByMemberId);
        const approver = getTeamMember(approval.approverMemberId);
        const decision = decisions[approval.key] ?? "pending";
        const isSelected = approval.key === selectedId;
        const isDecided = decision !== "pending";
        return (
          <li key={approval.key}>
            <button
              type="button"
              onClick={() => onSelect(approval.key)}
              aria-current={isSelected ? "true" : undefined}
              className={`w-full rounded-xl border p-3 text-left shadow-sm shadow-black/5 transition-colors ${
                isSelected
                  ? "border-accent/40 bg-accent/5"
                  : isDecided
                    ? "border-border bg-neutral-50 hover:bg-black/[0.02]"
                    : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`min-w-0 flex-1 text-sm font-semibold break-words ${
                    isDecided ? "text-neutral-500" : "text-foreground"
                  }`}
                >
                  {tApprovals(`items.${approval.key}`)}
                </p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${APPROVAL_STATUS_DOT_TONE[decision]}`} />
                  <span className={`text-xs font-medium whitespace-nowrap ${APPROVAL_STATUS_TEXT_TONE[decision]}`}>
                    {t(`approvals.status.${decision}`)}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs break-words text-neutral-500">{tTeams(approval.deptKey)}</p>

              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div className="min-w-0">
                  <p className="text-neutral-400">{t("approvals.columns.requestedBy")}</p>
                  <p className="break-words text-neutral-700">{requestedBy?.name ?? ""}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-neutral-400">{t("approvals.columns.approver")}</p>
                  <p className="break-words text-neutral-700">{approver?.name ?? ""}</p>
                </div>
              </div>

              <div className="mt-2 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">{t("approvals.columns.waitingSince")}</p>
                  <p className="text-xs break-words text-neutral-500">
                    {formatWaitingSince(approval.waitingSince, tAutomations)}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-sm font-semibold whitespace-nowrap ${
                    isDecided ? "text-neutral-500" : "text-foreground"
                  }`}
                >
                  {approval.amount}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
