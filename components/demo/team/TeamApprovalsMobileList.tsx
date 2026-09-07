import { useTranslations } from "next-intl";
import { APPROVALS, getTeamMember } from "@/lib/demo-data";
import { formatWaitingSince } from "./teamFormatters";

/**
 * Dense stacked approval card list for mobile (Stage 2I.2) — reuses APPROVALS/getTeamMember
 * directly, the same single approvals list the desktop table and Command Center's ApprovalsPanel
 * already read. No fake buttons, no cursor-pointer: this stage is still read-only (no detail, no
 * approve/reject action exists yet).
 */
export default function TeamApprovalsMobileList() {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <ul className="flex flex-col gap-2">
      {APPROVALS.map((approval) => {
        const requestedBy = getTeamMember(approval.requestedByMemberId);
        const approver = getTeamMember(approval.approverMemberId);
        return (
          <li key={approval.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-sm font-semibold break-words text-foreground">
                {tApprovals(`items.${approval.key}`)}
              </p>
              <span className="inline-flex shrink-0 items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                {t("approvals.status.pending")}
              </span>
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
              <p className="shrink-0 text-sm font-semibold whitespace-nowrap text-foreground">{approval.amount}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
