import { useTranslations } from "next-intl";
import {
  APPROVALS,
  getPendingApprovalsValue,
  getTeamMember,
  getTotalOpenResponsibilities,
  TEAM_MEMBERS,
} from "@/lib/demo-data";
import { areaLabel, formatWaitingSince } from "./teamFormatters";

const MEMBER_STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  away: "bg-neutral-200 text-neutral-600",
};

/**
 * Desktop-only Team & Approvals workspace (Stage 2I.1 — foundation). Hidden below the @5xl
 * container-query breakpoint, matching every other module's own desktop-foundation stage. No
 * selection/detail state: this stage is read-only — no row is clickable, no approve/reject
 * action exists yet (see spec sections 15–16).
 *
 * Pending Approvals is the strongest section (full width, first) since approvals are the most
 * time-sensitive management concern; Team & Responsibility (full width, below) shows who owns
 * what. Both tables read APPROVALS/TEAM_MEMBERS directly — the same single approvals list
 * Command Center's ApprovalsPanel already renders, never a second parallel dataset.
 */
export default function TeamDesktop() {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const summaryItems = [
    { key: "teamMembers", value: String(TEAM_MEMBERS.length) },
    { key: "pendingApprovals", value: String(APPROVALS.length) },
    { key: "approvalValue", value: `CHF ${getPendingApprovalsValue().toLocaleString("en-US")}` },
    { key: "openResponsibilities", value: String(getTotalOpenResponsibilities()) },
  ] as const;

  const roleLabel = (role: string) => (role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`));

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header — no greeting: that belongs only to Command Center. */}
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <div key={item.key} className="min-w-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="truncate text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className="mt-1 text-xl font-bold whitespace-nowrap text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals — the strongest section: full width, first. */}
      <div className="mb-4 shrink-0 rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
        <h4 className="px-4 pt-4 text-sm font-semibold text-foreground">{t("approvals.title")}</h4>
        <div className="mt-2 overflow-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-neutral-500">
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.request")}</th>
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.area")}</th>
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.requestedBy")}</th>
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.approver")}</th>
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.value")}</th>
                <th className="px-4 py-2.5 font-medium">{t("approvals.columns.waitingSince")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {APPROVALS.map((approval) => {
                const requestedBy = getTeamMember(approval.requestedByMemberId);
                const approver = getTeamMember(approval.approverMemberId);
                return (
                  <tr key={approval.key}>
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium break-words text-foreground">{tApprovals(`items.${approval.key}`)}</p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                        {t("approvals.status.pending")}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">{tTeams(approval.deptKey)}</td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">{requestedBy?.name ?? ""}</td>
                    <td className="px-4 py-3 align-top break-words text-neutral-600">{approver?.name ?? ""}</td>
                    <td className="px-4 py-3 align-top font-semibold break-words text-foreground">{approval.amount}</td>
                    <td className="px-4 py-3 align-top break-words text-neutral-500">
                      {formatWaitingSince(approval.waitingSince, tAutomations)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team & Responsibility — who owns what. */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
        <h4 className="px-4 pt-4 text-sm font-semibold text-foreground">{t("team.title")}</h4>
        <table className="mt-2 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-2.5 font-medium">{t("team.columns.member")}</th>
              <th className="px-4 py-2.5 font-medium">{t("team.columns.role")}</th>
              <th className="px-4 py-2.5 font-medium">{t("team.columns.responsibleFor")}</th>
              <th className="px-4 py-2.5 font-medium">{t("team.columns.openItems")}</th>
              <th className="px-4 py-2.5 font-medium">{t("team.columns.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                      {member.initials}
                    </span>
                    <span className="font-medium break-words text-foreground">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">{roleLabel(member.role)}</td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">
                  {member.areaKeys.map((key) => areaLabel(key, tSidebar, t)).join(" · ")}
                </td>
                <td className="px-4 py-3 align-top text-neutral-600">{member.openItems}</td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${MEMBER_STATUS_TONE[member.status]}`}
                  >
                    {t(`status.${member.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
