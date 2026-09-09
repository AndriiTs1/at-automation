"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useQuerySelection } from "@/components/demo/useQuerySelection";
import {
  APPROVALS,
  getTeamMember,
  getTotalOpenResponsibilities,
  TEAM_MEMBERS,
} from "@/lib/demo-data";
import ApprovalDetailMobile from "./ApprovalDetailMobile";
import { APPROVAL_STATUS_DOT_TONE, APPROVAL_STATUS_TEXT_TONE, type ApprovalDecision } from "./ApprovalDetailContent";
import TeamApprovalsMobileList from "./TeamApprovalsMobileList";
import TeamDesktop from "./TeamDesktop";
import TeamMembersMobileList from "./TeamMembersMobileList";
import { areaLabel, formatWaitingSince } from "./teamFormatters";

const MEMBER_STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  away: "bg-neutral-200 text-neutral-600",
};

/** Sums only CHF-valued approvals whose LOCAL decision is still "pending" — the same CHF-only-sum
 * rule as lib/demo-data.ts's getPendingApprovalsValue() (the 12% discountRequest is intentionally
 * excluded), reimplemented here rather than imported, since that shared helper has no concept of
 * this page's local, ephemeral decisions and must keep reading the real, unmutated APPROVALS for
 * Command Center/Automations. */
function getLocalPendingValue(decisions: Record<string, ApprovalDecision>): number {
  return APPROVALS.reduce((sum, approval) => {
    if ((decisions[approval.key] ?? "pending") !== "pending") return sum;
    if (!approval.amount.startsWith("CHF ")) return sum;
    return sum + Number(approval.amount.replace("CHF ", "").replace(/,/g, ""));
  }, 0);
}

function getLocalPendingCount(decisions: Record<string, ApprovalDecision>): number {
  return APPROVALS.filter((approval) => (decisions[approval.key] ?? "pending") === "pending").length;
}

/**
 * Compact KPI grid shared by mobile (2 columns) and tablet (4 columns) — the same 4 approved
 * metrics as desktop's own summary row. `pendingCount`/`pendingValue` are passed in already
 * computed against this page's local decisions state, so this component never needs its own copy
 * of the CHF-summing logic.
 */
function KpiGrid({ columns, pendingCount, pendingValue }: { columns: 2 | 4; pendingCount: number; pendingValue: number }) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const summaryItems = [
    { key: "teamMembers", value: String(TEAM_MEMBERS.length) },
    { key: "pendingApprovals", value: String(pendingCount) },
    { key: "approvalValue", value: `CHF ${pendingValue.toLocaleString("en-US")}` },
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
 * (mobile / tablet / desktop), like every other module's own Workspace. Pending Approvals is now
 * the only interactive section: selection is the URL's own `?approval=<key>` (approval.key is
 * already a stable, unique identifier — no new id was invented), read/written via the shared
 * useQuerySelection hook exactly like Customers' own record-level deep link. Team & Responsibility
 * stays completely read-only in all three presentations.
 *
 * Approve/Reject decisions live in page-local `decisions` state, keyed by approval.key, and are
 * NEVER written back to the imported APPROVALS array — lib/demo-data.ts documents that APPROVALS
 * must stay at exactly 3 unmutated entries since Command Center's awaiting-approval count and
 * Automations' approvalRouting.runsToday both read APPROVALS.length directly. Reloading this page
 * resets `decisions` to empty (all pending again) — intentional demo behavior.
 */
export default function TeamWorkspace() {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const [approvalParam, clearApprovalParam, selectApproval] = useQuerySelection("approval");
  const selectedId = approvalParam && APPROVALS.some((approval) => approval.key === approvalParam) ? approvalParam : null;
  const selectedApproval = APPROVALS.find((approval) => approval.key === selectedId) ?? null;

  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});
  const selectedDecision: ApprovalDecision = selectedApproval ? (decisions[selectedApproval.key] ?? "pending") : "pending";

  const handleApprove = useCallback((key: string) => {
    setDecisions((prev) => ({ ...prev, [key]: "approved" }));
  }, []);
  const handleReject = useCallback((key: string) => {
    setDecisions((prev) => ({ ...prev, [key]: "rejected" }));
  }, []);

  const pendingCount = getLocalPendingCount(decisions);
  const pendingValue = getLocalPendingValue(decisions);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearApprovalParam();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, clearApprovalParam]);

  const roleLabel = (role: string) => (role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`));

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <div className="shrink-0">
          <p className="text-base font-semibold text-foreground">{t("title")}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{t("description")}</p>
        </div>
        <KpiGrid columns={2} pendingCount={pendingCount} pendingValue={pendingValue} />
        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">{t("approvals.title")}</h4>
          <TeamApprovalsMobileList selectedId={selectedId} onSelect={selectApproval} decisions={decisions} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">{t("team.title")}</h4>
          <TeamMembersMobileList />
        </div>
        {selectedApproval && (
          <ApprovalDetailMobile
            approval={selectedApproval}
            decision={selectedDecision}
            onApprove={() => handleApprove(selectedApproval.key)}
            onReject={() => handleReject(selectedApproval.key)}
            onClose={clearApprovalParam}
          />
        )}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="shrink-0">
          <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <KpiGrid columns={4} pendingCount={pendingCount} pendingValue={pendingValue} />

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
                  const decision = decisions[approval.key] ?? "pending";
                  const isSelected = approval.key === selectedId;
                  const isDecided = decision !== "pending";
                  return (
                    <tr
                      key={approval.key}
                      tabIndex={0}
                      aria-selected={isSelected}
                      onClick={() => selectApproval(approval.key)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectApproval(approval.key);
                        }
                      }}
                      className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                        isSelected ? "bg-accent/5" : isDecided ? "bg-neutral-50 hover:bg-black/[0.02]" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="px-3 py-2.5 align-top">
                        <p className={`font-medium break-words ${isDecided ? "text-neutral-500" : "text-foreground"}`}>
                          {tApprovals(`items.${approval.key}`)}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${APPROVAL_STATUS_DOT_TONE[decision]}`}
                          />
                          <span className={`text-[11px] font-medium ${APPROVAL_STATUS_TEXT_TONE[decision]}`}>
                            {t(`approvals.status.${decision}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{tTeams(approval.deptKey)}</td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{requestedBy?.name ?? ""}</td>
                      <td className="px-3 py-2.5 align-top break-words text-neutral-600">{approver?.name ?? ""}</td>
                      <td
                        className={`px-3 py-2.5 align-top font-semibold break-words ${
                          isDecided ? "text-neutral-500" : "text-foreground"
                        }`}
                      >
                        {approval.amount}
                      </td>
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

        {selectedApproval && (
          <ApprovalDetailMobile
            approval={selectedApproval}
            decision={selectedDecision}
            onApprove={() => handleApprove(selectedApproval.key)}
            onReject={() => handleReject(selectedApproval.key)}
            onClose={clearApprovalParam}
          />
        )}
      </div>

      {/* Desktop workspace (@5xl and up) */}
      <TeamDesktop
        selectedId={selectedId}
        onSelectRow={selectApproval}
        onCloseDetail={clearApprovalParam}
        decisions={decisions}
        onApprove={handleApprove}
        onReject={handleReject}
        pendingCount={pendingCount}
        pendingValue={pendingValue}
      />
    </>
  );
}
