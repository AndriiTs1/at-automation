import { useTranslations } from "next-intl";
import { CUSTOMERS_ROWS, INVENTORY_ROWS, type AutomationRun, type AutomationTimestamp } from "@/lib/demo-data";

/** Shared by AutomationsDesktop's Recent Activity aside and AutomationDetailContent's Recent
 * executions list, so both render an AutomationRun's timestamp/related entity identically. */
export function formatAutomationTimestamp(ts: AutomationTimestamp, t: ReturnType<typeof useTranslations>) {
  if (ts.kind === "date") return `${ts.date}, ${ts.time}`;
  return `${t(`relativeTime.${ts.kind}`)}, ${ts.time}`;
}

/**
 * Resolves an AutomationRun's related entity to a display label by reading the real record it
 * points at (never a duplicated copy) — mirrors how FinanceTable resolves customer/operation via
 * getFinanceCustomer/getFinanceOperation. Invoice and operation ids are shown as-is (same
 * convention as Finance/Operations tables); inventory items and customers show their name.
 */
export function getAutomationRunEntityLabel(run: AutomationRun, tApprovals: ReturnType<typeof useTranslations>) {
  if (!run.relatedEntityId) return null;
  switch (run.relatedEntityType) {
    case "inventoryItem":
      return INVENTORY_ROWS.find((item) => item.id === run.relatedEntityId)?.name ?? run.relatedEntityId;
    case "customer":
      return CUSTOMERS_ROWS.find((customer) => customer.id === run.relatedEntityId)?.name ?? run.relatedEntityId;
    case "approval":
      return tApprovals(`items.${run.relatedEntityId}`);
    default:
      return run.relatedEntityId;
  }
}
