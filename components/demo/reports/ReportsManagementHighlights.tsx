import { useTranslations } from "next-intl";
import { DashboardIcon } from "@/components/dashboard/icons";

const HIGHLIGHT_ICONS: Record<string, string> = {
  overdueReceivables: "receipt",
  paymentReconciliationException: "sync",
  lowStockItems: "box",
  customersNeedAttention: "users",
  automationsNeedAttention: "bolt",
};
import { getManagementHighlights } from "@/lib/demo-data";

/**
 * Concise "what should I care about?" list (Stage 2H.1) — every row resolves from
 * getManagementHighlights(), which itself only derives from existing Finance/Inventory/Customers/
 * Automations truth. Plain list rows, not buttons: no drill-down exists yet, so nothing here
 * should look clickable (see spec section 19).
 */
export default function ReportsManagementHighlights() {
  const t = useTranslations("Dashboard.Reports");
  const tAutomations = useTranslations("Dashboard.Automations");
  const highlights = getManagementHighlights();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <div className="mb-3 flex shrink-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name="list" className="h-5 w-5" />
        </span>
        <h4 className="text-sm font-semibold text-foreground">{t("highlights.title")}</h4>
      </div>
      <ul className="flex flex-1 flex-col divide-y divide-border overflow-y-auto">
        {highlights.map((item) => {
          const text =
            item.key === "overdueReceivables"
              ? t("highlights.overdueReceivables", { amount: item.amount, count: item.count })
              : item.key === "paymentReconciliationException"
                ? t("highlights.paymentReconciliationException", {
                    name: tAutomations("definitions.paymentReconciliation.name"),
                  })
                : item.key === "lowStockItems"
                  ? t("highlights.lowStockItems", { count: item.count })
                  : item.key === "customersNeedAttention"
                    ? t("highlights.customersNeedAttention", { count: item.count })
                    : t("highlights.automationsNeedAttention", { count: item.count });

          return (
            <li key={item.key} className="flex items-center gap-2.5 py-1.5 text-sm text-foreground">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                item.key === "overdueReceivables"
                  ? "bg-error/10 text-error"
                  : "bg-warning/10 text-warning"
              }`}>
                <DashboardIcon name={HIGHLIGHT_ICONS[item.key] ?? "info"} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 break-words">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
