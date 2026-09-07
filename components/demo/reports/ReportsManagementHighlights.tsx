import { useTranslations } from "next-intl";
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
      <h4 className="mb-2 shrink-0 text-sm font-semibold text-foreground">{t("highlights.title")}</h4>
      <ul className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
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
            <li key={item.key} className="flex items-start gap-2 text-sm text-neutral-600">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
              <span className="min-w-0 flex-1 break-words">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
