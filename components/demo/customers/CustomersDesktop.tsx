import { useTranslations } from "next-intl";
import { ChevronDownIcon, SearchIcon } from "@/components/dashboard/icons";
import { CUSTOMERS_ROWS, CUSTOMERS_SUMMARY, type CustomerRow } from "@/lib/demo-data";

const SUMMARY_ITEMS = [
  { key: "totalCustomers", value: CUSTOMERS_SUMMARY.totalCustomers, tone: "accent" },
  { key: "activeAccounts", value: CUSTOMERS_SUMMARY.activeAccounts, tone: "success" },
  { key: "needsAttention", value: CUSTOMERS_SUMMARY.needsAttention, tone: "error" },
  { key: "outstanding", value: CUSTOMERS_SUMMARY.outstanding, tone: "accent" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

const HEALTH_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  watch: "bg-warning/10 text-warning",
  atRisk: "bg-error/10 text-error",
};

const SEGMENT_TONE: Record<string, string> = {
  keyAccount: "bg-neutral-100 font-semibold text-neutral-700",
  standard: "bg-neutral-100 text-neutral-500",
  new: "bg-neutral-100 text-neutral-500",
};

function formatLastActivity(entry: CustomerRow["lastActivity"], t: ReturnType<typeof useTranslations>) {
  if (entry.kind === "date") return `${entry.date}, ${entry.time}`;
  return `${t(`relativeTime.${entry.kind}`)}, ${entry.time}`;
}

/**
 * Desktop-only Customers workspace foundation. Hidden below the @5xl container-query
 * breakpoint, mirroring how Operations began in Stage 2B.1 — tablet/mobile adaptation and
 * customer detail interaction are later stages. Toolbar controls are visual-only for now.
 */
export default function CustomersDesktop() {
  const t = useTranslations("Dashboard.Customers");

  return (
    <div className="hidden min-h-0 flex-1 @5xl:flex @5xl:flex-col">
      {/* Page header */}
      <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          {t("newCustomer")}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-4 grid shrink-0 grid-cols-4 gap-3">
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.key} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
            <p className="text-xs text-neutral-500">{t(`summary.${item.key}`)}</p>
            <p className={`mt-1 text-xl font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar (visual foundation only — functional filtering is a later stage) */}
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <div className="flex w-64 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm text-neutral-400">
          <SearchIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{t("toolbar.searchPlaceholder")}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm text-neutral-500">
          <span>{t("toolbar.allSegments")}</span>
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm text-neutral-500">
          <span>{t("toolbar.allHealth")}</span>
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-xl border border-border bg-surface shadow-sm shadow-black/5">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">{t("table.customer")}</th>
              <th className="px-4 py-3 font-medium">{t("table.segment")}</th>
              <th className="px-4 py-3 font-medium">{t("table.health")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("table.openOperations")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("table.revenue")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("table.outstanding")}</th>
              <th className="px-4 py-3 font-medium">{t("table.owner")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("table.lastActivity")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CUSTOMERS_ROWS.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-black/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{row.id}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${SEGMENT_TONE[row.segment]}`}
                  >
                    {t(`segment.${row.segment}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${HEALTH_TONE[row.health]}`}
                  >
                    {t(`health.${row.health}`)}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right ${row.openOperations === 0 ? "text-neutral-400" : "font-medium text-foreground"}`}>
                  {row.openOperations}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{row.revenue}</td>
                <td className={`px-4 py-3 text-right ${row.outstanding === "CHF 0" ? "text-neutral-400" : "font-medium text-foreground"}`}>
                  {row.outstanding}
                </td>
                <td className="px-4 py-3 text-neutral-600">{row.owner}</td>
                <td className="px-4 py-3 text-right text-xs text-neutral-400">{formatLastActivity(row.lastActivity, t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
