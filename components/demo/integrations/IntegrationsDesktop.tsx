import { useTranslations } from "next-intl";
import { INTEGRATION_DEFINITIONS, getIntegrationCounts, type AutomationTimestamp, type IntegrationDefinition } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  connected: "bg-success/10 text-success",
  demo: "bg-accent/10 text-accent",
  ready: "bg-neutral-200 text-neutral-600",
  notConnected: "bg-neutral-100 text-neutral-400",
};

const CATEGORY_ORDER = ["erp", "crm", "accounting", "warehouse", "payments", "ecommerce", "email", "internal"] as const;
const MODULE_ORDER = ["operations", "finance", "inventory", "customers", "automations"] as const;

const COLUMN_WIDTHS = ["16%", "10%", "17%", "10%", "26%", "21%"];

function systemDisplayName(integration: IntegrationDefinition, t: ReturnType<typeof useTranslations>) {
  return integration.systemName ?? t(`systems.${integration.key}.name`);
}

/** Reuses Dashboard.Automations' existing relativeTime labels ("Today"/"Yesterday") rather than
 * duplicating them in a new namespace — same wording, same concept, already localized. */
function formatLastSync(
  sync: AutomationTimestamp | null | undefined,
  t: ReturnType<typeof useTranslations>,
  tAutomations: ReturnType<typeof useTranslations>,
) {
  if (!sync) return t("noLastSync");
  if (sync.kind === "date") return `${sync.date}, ${sync.time}`;
  return `${tAutomations(`relativeTime.${sync.kind}`)}, ${sync.time}`;
}

/**
 * Desktop-only Integrations workspace (Stage 2G.1) — foundation only: read-only system
 * landscape, no selection, no detail, no filters. A Server Component like
 * FinanceCashFlowSummary/FinanceOperationsSummary (no client-side state exists yet), hidden
 * below the @5xl container-query breakpoint, matching every other module's own desktop-
 * foundation stage. All counts are derived from INTEGRATION_DEFINITIONS via getIntegrationCounts()
 * — never a re-typed literal — and every automation/module reference resolves live rather than
 * duplicating a business fact already owned by Automations/Finance/Inventory/etc.
 */
export default function IntegrationsDesktop() {
  const t = useTranslations("Dashboard.Integrations");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const counts = getIntegrationCounts();

  const summaryItems = [
    { key: "connected", value: String(counts.connected), tone: "text-success" },
    { key: "ready", value: String(counts.ready), tone: "text-accent" },
    { key: "demo", value: String(counts.demo), tone: "text-accent" },
    { key: "businessSystems", value: String(counts.total), tone: "text-foreground" },
  ] as const;

  const moduleLabel = (key: string) => (key === "automations" ? tSidebar("items.automations") : tAutomations(`category.${key}`));

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
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* System landscape — business systems -> AT -> business workflows, in one compact strip. */}
      <div className="mb-4 shrink-0 rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
        <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("landscape.title")}</p>
        <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-neutral-500">{t("landscape.businessSystemsLabel")}</p>
            <p className="mt-0.5 text-sm break-words text-foreground">
              {CATEGORY_ORDER.map((key) => t(`category.${key}`)).join(" · ")}
            </p>
          </div>
          <span aria-hidden="true" className="text-neutral-300">
            →
          </span>
          <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-accent">
            {t("landscape.atLayerLabel")}
          </span>
          <span aria-hidden="true" className="text-neutral-300">
            →
          </span>
          <div className="min-w-0">
            <p className="text-xs text-neutral-500">{t("landscape.workflowsLabel")}</p>
            <p className="mt-0.5 text-sm break-words text-foreground">
              {MODULE_ORDER.map((key) => moduleLabel(key)).join(" · ")}
            </p>
          </div>
        </div>
      </div>

      {/* Integration list */}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">{t("table.system")}</th>
              <th className="px-4 py-3 font-medium">{t("table.category")}</th>
              <th className="px-4 py-3 font-medium">{t("table.status")}</th>
              <th className="px-4 py-3 font-medium">{t("table.direction")}</th>
              <th className="px-4 py-3 font-medium">{t("table.businessData")}</th>
              <th className="px-4 py-3 font-medium">{t("table.usedBy")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {INTEGRATION_DEFINITIONS.map((integration) => (
              <tr key={integration.id}>
                <td className="px-4 py-3 align-top font-semibold break-words text-foreground">
                  {systemDisplayName(integration, t)}
                </td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">{t(`category.${integration.category}`)}</td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-medium break-words ${STATUS_TONE[integration.status]}`}
                  >
                    {t(`status.${integration.status}`)}
                  </span>
                  <p className="mt-1 text-xs break-words text-neutral-400">
                    {formatLastSync(integration.lastSync, t, tAutomations)}
                  </p>
                </td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">{t(`direction.${integration.direction}`)}</td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">
                  {integration.dataFlowKeys.map((key) => t(`dataFlow.${key}`)).join(" · ")}
                </td>
                <td className="px-4 py-3 align-top break-words text-neutral-600">
                  {(integration.relatedModuleKeys ?? []).map((key) => moduleLabel(key)).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
