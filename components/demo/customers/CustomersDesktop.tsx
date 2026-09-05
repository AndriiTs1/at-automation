import { useTranslations } from "next-intl";
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
 * Header/KPIs stay static (server-rendered); the toolbar, row selection/filtering and the
 * customer detail panel are owned by CustomersWorkspace (Stage 2C.3).
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

      {/* Toolbar + table + detail panel — owned by CustomersWorkspace (Stage 2C.3) */}
      <CustomersWorkspace />
    </div>
  );
}
