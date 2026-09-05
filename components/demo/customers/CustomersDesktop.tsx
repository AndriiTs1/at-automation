import { useTranslations } from "next-intl";
import { ChevronDownIcon, SearchIcon } from "@/components/dashboard/icons";
import { CUSTOMERS_SUMMARY } from "@/lib/demo-data";
import CustomersWorkspace from "./CustomersWorkspace";

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

/**
 * Desktop-only Customers workspace. Hidden below the @5xl container-query breakpoint.
 * Header/KPIs/toolbar stay static (server-rendered); row selection and the customer detail
 * panel are owned by CustomersWorkspace, the smallest client boundary needed (Stage 2C.2).
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

      {/* Table + detail panel */}
      <CustomersWorkspace />
    </div>
  );
}
