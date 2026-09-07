"use client";

import { useTranslations } from "next-intl";
import {
  APPROVALS,
  getPendingApprovalsValue,
  getTeamMember,
  getTotalOpenResponsibilities,
  TEAM_MEMBERS,
} from "@/lib/demo-data";
import TeamApprovalsMobileList from "./TeamApprovalsMobileList";
import TeamDesktop from "./TeamDesktop";
import TeamMembersMobileList from "./TeamMembersMobileList";
import { areaLabel, formatWaitingSince } from "./teamFormatters";

const MEMBER_STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  away: "bg-neutral-200 text-neutral-600",
};

/**
 * Compact KPI grid shared by mobile (2 columns) and tablet (4 columns) — the same 4 approved
 * metrics as desktop's own summary row, read from the same helpers, never re-typed. Kept as a
 * separate implementation from TeamDesktop's inline summary row, mirroring Reports/Automations/
 * Finance/Integrations' own established SummaryGrid pattern: desktop stays completely untouched.
 */
function KpiGrid({ columns }: { columns: 2 | 4 }) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const summaryItems = [
    { key: "teamMembers", value: String(TEAM_MEMBERS.length) },
    { key: "pendingApprovals", value: String(APPROVALS.length) },
    { key: "approvalValue", value: `CHF ${getPendingApprovalsValue().toLocaleString("en-US")}` },
    { key: "openResponsibilities", value: String(getTotalOpenResponsibilities()) },
  ] as const;

  return (
    <div className={`grid shrink-0 gap-2 ${columns === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
      {summaryItems.map((item) => (
        <div key={item.key} className="min-w-0 rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
          <p className="text-xs leading-tight break-words text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className="mt-1 text-lg leading-tight font-bold break-words whitespace-nowrap text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Top-level Team & Approvals workspace — fans out to three breakpoint-gated presentations
 * (mobile / tablet / desktop), like every other module's own Workspace. Still no selection/
 * detail state anywhere: this stage remains read-only (no drill-down, no approve/reject action —
 * see spec section 3).
 *
 * Mobile follows the exact order the spec requires: title → description → KPIs (2x2) → Pending
 * approvals (stacked cards) → Team & responsibility (stacked cards). Tablet keeps a real table
 * for both sections (4-column KPI row, then Pending approvals and Team & responsibility tables) —
 * tested at 768–834px and found comfortably readable, so no separate 2-column card fallback was
 * needed for approvals.
 *
 * Desktop is untouched from Stage 2I.1 (TeamDesktop is self-gated behind `@5xl:flex` and rendered
 * unconditionally here, exactly like ReportsDesktop/AutomationsDesktop).
 */
export default function TeamWorkspace() {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const roleLabel = (role: string) => (role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`));

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <div className="shrink-0">
          <p className="text-base font-semibold text-foreground">{t("title")}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{t("description")}</p>
        </div>
        <KpiGrid columns={2} />
        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">{t("approvals.title")}</h4>
          <TeamApprovalsMobileList />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">{t("team.title")}</h4>
          <TeamMembersMobileList />
        </div>
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <KpiGrid columns={4} />

        <div className="shrink-0 rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
          <h4 className="px-3 pt-3 text-sm font-semibold text-foreground">{t("approvals.title")}</h4>
          <div className="mt-2 overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-neutral-500">
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.request")}</th>
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.area")}</th>
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.requestedBy")}</th>
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.approver")}</th>
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.value")}</th>
                  <th className="px-3 py-2 font-medium">{t("approvals.columns.waitingSince")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {APPROVALS.map((approval) => {
                  const requestedBy = getTeamMember(approval.requestedByMemberId);
                  const approver = getTeamMember(approval.approverMemberId);
                  return (
                    <tr key={approval.key}>
                      <td className="px-3 py-2.5 align-top">
                        <p className="font-medium break-words text-foreground">{tApprovals(`items.${approval.key}`)}</p>
                        <span className="mt-1 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                          {t("approvals.status.pending")}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{tTeams(approval.deptKey)}</td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{requestedBy?.name ?? ""}</td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{approver?.name ?? ""}</td>
                      <td className="px-3 py-2.5 align-top font-semibold break-words text-foreground">{approval.amount}</td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-500">
                        {formatWaitingSince(approval.waitingSince, tAutomations)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
          <h4 className="px-3 pt-3 text-sm font-semibold text-foreground">{t("team.title")}</h4>
          <table className="mt-2 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-neutral-500">
                <th className="px-3 py-2 font-medium">{t("team.columns.member")}</th>
                <th className="px-3 py-2 font-medium">{t("team.columns.role")}</th>
                <th className="px-3 py-2 font-medium">{t("team.columns.responsibleFor")}</th>
                <th className="px-3 py-2 font-medium">{t("team.columns.openItems")}</th>
                <th className="px-3 py-2 font-medium">{t("team.columns.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEAM_MEMBERS.map((member) => (
                <tr key={member.id}>
                  <td className="px-3 py-2.5 align-top">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                        {member.initials}
                      </span>
                      <span className="font-medium break-words text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-top break-words text-neutral-600">{roleLabel(member.role)}</td>
                  <td className="px-3 py-2.5 align-top break-words text-neutral-600">
                    {member.areaKeys.map((key) => areaLabel(key, tSidebar, t)).join(" · ")}
                  </td>
                  <td className="px-3 py-2.5 align-top text-neutral-600">{member.openItems}</td>
                  <td className="px-3 py-2.5 align-top">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${MEMBER_STATUS_TONE[member.status]}`}
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

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2I.1 */}
      <TeamDesktop />
    </>
  );
}
