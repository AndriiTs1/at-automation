import { useTranslations } from "next-intl";

export type ApprovalWaitingSince = { kind: "today" | "yesterday"; time: string };

/** Reuses Dashboard.Automations' existing relativeTime labels ("Today"/"Yesterday") rather than
 * duplicating them in a new namespace — same wording, same concept as Integrations' own
 * formatLastSync, already localized. */
export function formatWaitingSince(waitingSince: ApprovalWaitingSince, tAutomations: ReturnType<typeof useTranslations>) {
  return `${tAutomations(`relativeTime.${waitingSince.kind}`)}, ${waitingSince.time}`;
}

/** Resolves one areaKey against either an existing Dashboard.Sidebar module name (reused, never
 * re-typed) or this module's own small Dashboard.TeamApprovals.areas set for concepts no other
 * module already names (company-wide approvals, management, reconciliation, replenishment). */
const SIDEBAR_AREA_KEYS = new Set(["operations", "customers", "inventory", "finance"]);

export function areaLabel(
  key: string,
  tSidebar: ReturnType<typeof useTranslations>,
  tTeamApprovals: ReturnType<typeof useTranslations>,
) {
  return SIDEBAR_AREA_KEYS.has(key) ? tSidebar(`items.${key}`) : tTeamApprovals(`areas.${key}`);
}
