import { useTranslations } from "next-intl";
import type { AutomationTimestamp, IntegrationDefinition } from "@/lib/demo-data";

/** `systemName` is a literal for real third-party products; generic/fictional systems fall back
 * to the translated `systems.<key>.name` label. Shared by the table and the detail header so
 * both resolve a system's display name identically. */
export function systemDisplayName(integration: IntegrationDefinition, t: ReturnType<typeof useTranslations>) {
  return integration.systemName ?? t(`systems.${integration.key}.name`);
}

/** Reuses Dashboard.Automations' existing relativeTime labels ("Today"/"Yesterday") rather than
 * duplicating them in a new namespace — same wording, same concept, already localized. Shared by
 * the table's Status cell and the detail's Last activity section. */
export function formatLastSync(
  sync: AutomationTimestamp | null | undefined,
  t: ReturnType<typeof useTranslations>,
  tAutomations: ReturnType<typeof useTranslations>,
) {
  if (!sync) return t("noLastSync");
  if (sync.kind === "date") return `${sync.date}, ${sync.time}`;
  return `${tAutomations(`relativeTime.${sync.kind}`)}, ${sync.time}`;
}
