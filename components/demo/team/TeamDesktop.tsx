import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { APPROVALS, getTeamMember, getTotalOpenResponsibilities, TEAM_MEMBERS } from "@/lib/demo-data";
import ApprovalDetailPanel from "./ApprovalDetailPanel";
import { APPROVAL_STATUS_DOT_TONE, APPROVAL_STATUS_TEXT_TONE, type ApprovalDecision } from "./ApprovalDetailContent";
import { areaLabel, formatWaitingSince } from "./teamFormatters";

const MEMBER_STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  away: "bg-neutral-200 text-neutral-600",
};

// Below @6xl (1152px container width — the same breakpoint established for Automations/
// Integrations' own open-state tables) with the inspector open, even the 4-column wide-open set
// below leaves too little room next to the 420px ApprovalDetailPanel. A second, smaller table
// (own colgroup, table-fixed) takes over at that width — Request + Value only, the two columns
// that stay genuinely useful next to an open approval inspector.
const MIN_TABLE_WIDTH_OPEN_NARROW = 260;
const COLUMN_WIDTHS_OPEN_NARROW = ["60%", "40%"];

// Wide-open (≥@6xl) compact set: Approver and Waiting since drop out — both are already visible
// inside the open inspector itself — while Request/Area/Requested by/Value keep the closed
// table's own relative emphasis, rebalanced to fill the narrower open-state width.
const MIN_TABLE_WIDTH_OPEN_WIDE = 520;
const COLUMN_WIDTHS_OPEN_WIDE = ["34%", "18%", "26%", "22%"];

/**
 * Desktop-only Team & Approvals workspace. Hidden below the @5xl container-query breakpoint,
 * matching every other module's own desktop-foundation stage. Pending Approvals is now the only
 * interactive section (row click opens ApprovalDetailPanel via the shared DetailInspectorShell,
 * a true flex-row split — never an overlay) — Team & Responsibility stays exactly as before:
 * read-only, no row click, no selection, rendered full width below regardless of whether the
 * approvals inspector is open.
 *
 * `decisions` is page-local state owned by TeamWorkspace, never written back to the imported
 * APPROVALS array — pendingCount/pendingValue are passed in already computed against that local
 * state so this component never needs its own copy of the CHF-summing logic.
 */
export default function TeamDesktop({
  selectedId,
  onSelectRow,
  onCloseDetail,
  decisions,
  onApprove,
  onReject,
  pendingCount,
  pendingValue,
}: {
  selectedId: string | null;
  onSelectRow: (key: string) => void;
  onCloseDetail: () => void;
  decisions: Record<string, ApprovalDecision>;
  onApprove: (key: string) => void;
  onReject: (key: string) => void;
  pendingCount: number;
  pendingValue: number;
}) {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tApprovals = useTranslations("Dashboard.Approvals");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tTeams = useTranslations("Dashboard.Teams");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const selectedApproval = APPROVALS.find((approval) => approval.key === selectedId) ?? null;
  const isInspectorOpen = selectedApproval !== null;
  const selectedDecision: ApprovalDecision = selectedApproval ? (decisions[selectedApproval.key] ?? "pending") : "pending";

  const summaryItems = [
    { key: "teamMembers", value: String(TEAM_MEMBERS.length) },
    { key: "pendingApprovals", value: String(pendingCount) },
    { key: "approvalValue", value: `CHF ${pendingValue.toLocaleString("en-US")}` },
    { key: "openResponsibilities", value: String(getTotalOpenResponsibilities()) },
  ] as const;

  const roleLabel = (role: string) => (role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`));

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, key: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectRow(key);
    }
  };

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

      {/* Pending Approvals + inspector — a real flex row, not an overlay, so the inspector
          genuinely takes 420px of width instead of being painted over the table underneath.
          Team & Responsibility below is a separate, always-full-width sibling, untouched by
          whether this row's inspector is open. */}
      <div className="relative mb-4 flex shrink-0">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
          <h4 className="px-4 pt-4 text-sm font-semibold text-foreground">{t("approvals.title")}</h4>
          <div className="mt-2 overflow-auto">
            {isInspectorOpen && (
              <table
                className="w-full table-fixed border-collapse text-left text-sm @6xl:hidden"
                style={{ minWidth: `${MIN_TABLE_WIDTH_OPEN_NARROW}px` }}
              >
                <colgroup>
                  {COLUMN_WIDTHS_OPEN_NARROW.map((width, index) => (
                    <col key={index} style={{ width }} />
                  ))}
                </colgroup>
                <thead>
                  <tr className="border-b border-border text-xs text-neutral-500">
                    <th className="px-4 py-2.5 font-medium">{t("approvals.columns.request")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("approvals.columns.value")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {APPROVALS.map((approval) => {
                    const decision = decisions[approval.key] ?? "pending";
                    const isSelected = approval.key === selectedId;
                    const isDecided = decision !== "pending";
                    return (
                      <tr
                        key={approval.key}
                        tabIndex={0}
                        aria-selected={isSelected}
                        onClick={() => onSelectRow(approval.key)}
                        onKeyDown={(event) => handleRowKeyDown(event, approval.key)}
                        className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                          isSelected ? "bg-accent/5" : isDecided ? "bg-neutral-50 hover:bg-black/[0.02]" : "hover:bg-black/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-3 align-top">
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
                        <td
                          className={`px-4 py-3 text-right align-top font-semibold break-words whitespace-nowrap ${
                            isDecided ? "text-neutral-500" : "text-foreground"
                          }`}
                        >
                          {approval.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <table
              className={`w-full table-fixed border-collapse text-left text-sm ${isInspectorOpen ? "hidden @6xl:table" : ""}`}
              style={isInspectorOpen ? { minWidth: `${MIN_TABLE_WIDTH_OPEN_WIDE}px` } : undefined}
            >
              {isInspectorOpen && (
                <colgroup>
                  {COLUMN_WIDTHS_OPEN_WIDE.map((width, index) => (
                    <col key={index} style={{ width }} />
                  ))}
                </colgroup>
              )}
              <thead>
                <tr className="border-b border-border text-xs text-neutral-500">
                  <th className="px-4 py-2.5 font-medium">{t("approvals.columns.request")}</th>
                  <th className="px-4 py-2.5 font-medium">{t("approvals.columns.area")}</th>
                  <th className="px-4 py-2.5 font-medium">{t("approvals.columns.requestedBy")}</th>
                  {!isInspectorOpen && <th className="px-4 py-2.5 font-medium">{t("approvals.columns.approver")}</th>}
                  <th className="px-4 py-2.5 font-medium">{t("approvals.columns.value")}</th>
                  {!isInspectorOpen && <th className="px-4 py-2.5 font-medium">{t("approvals.columns.waitingSince")}</th>}
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
                      onClick={() => onSelectRow(approval.key)}
                      onKeyDown={(event) => handleRowKeyDown(event, approval.key)}
                      className={`cursor-pointer transition-colors focus-visible:bg-accent/10 focus-visible:outline-none ${
                        isSelected ? "bg-accent/5" : isDecided ? "bg-neutral-50 hover:bg-black/[0.02]" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="px-4 py-3 align-top">
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
                      <td className="px-4 py-3 align-top break-words text-neutral-600">{tTeams(approval.deptKey)}</td>
                      <td className="px-4 py-3 align-top break-words text-neutral-600">{requestedBy?.name ?? ""}</td>
                      {!isInspectorOpen && (
                        <td className="px-4 py-3 align-top break-words text-neutral-600">{approver?.name ?? ""}</td>
                      )}
                      <td
                        className={`px-4 py-3 align-top font-semibold break-words ${
                          isDecided ? "text-neutral-500" : "text-foreground"
                        }`}
                      >
                        {approval.amount}
                      </td>
                      {!isInspectorOpen && (
                        <td className="px-4 py-3 align-top break-words text-neutral-500">
                          {formatWaitingSince(approval.waitingSince, tAutomations)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedApproval && (
          <>
            {/* Subtle workspace-level scrim — communicates layering without darkening the app or
                blocking recognition of the table underneath. Decorative: X and Escape are the
                primary close mechanisms, so this stays out of tab order and hidden from AT. */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={onCloseDetail}
              className="absolute inset-0 z-10 cursor-default bg-black/[0.02]"
            />
            <ApprovalDetailPanel
              approval={selectedApproval}
              decision={selectedDecision}
              onApprove={() => onApprove(selectedApproval.key)}
              onReject={() => onReject(selectedApproval.key)}
              onClose={onCloseDetail}
            />
          </>
        )}
      </div>

      {/* Team & Responsibility — who owns what. Unchanged: read-only, no selection, always full
          width regardless of the approvals inspector above. */}
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
