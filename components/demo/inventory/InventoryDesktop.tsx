import { useTranslations } from "next-intl";
import { INVENTORY_SUMMARY } from "@/lib/demo-data";
import InventoryWorkspace from "./InventoryWorkspace";

const SUMMARY_ITEMS = [
  { key: "totalItems", value: INVENTORY_SUMMARY.totalItems, tone: "accent" },
  { key: "lowStock", value: INVENTORY_SUMMARY.lowStock, tone: "error" },
  { key: "reservedUnits", value: INVENTORY_SUMMARY.reservedUnits, tone: "accent" },
  { key: "inventoryValue", value: INVENTORY_SUMMARY.inventoryValue, tone: "success" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/**
 * Desktop-only Inventory workspace. Hidden below the @5xl container-query breakpoint, matching
 * CustomersDesktop/OperationsDesktop's own threshold. Header/KPIs stay static and
 * server-rendered — the toolbar, row selection/filtering and the Inventory Detail overlay
 * drawer are all owned by InventoryWorkspace (Stage 2D.3).
 */
export default function InventoryDesktop() {
  const t = useTranslations("Dashboard.Inventory");

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
          {t("newItem")}
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

      {/* Toolbar + table + detail overlay drawer — owned by InventoryWorkspace (Stage 2D.3) */}
      <InventoryWorkspace />
    </div>
  );
}
