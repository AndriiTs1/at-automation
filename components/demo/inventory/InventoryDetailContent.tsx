import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/dashboard/icons";
import { getAvailableUnits, getReservationsForItem, type InventoryItem } from "@/lib/demo-data";

const STATUS_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  low: "bg-warning/10 text-warning",
  critical: "bg-error/10 text-error",
  outOfStock: "bg-neutral-200 text-neutral-600",
};

const OPERATION_STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};

/**
 * Shared Inventory Detail body (header, stock overview, stock status, connected operations,
 * replenishment, value). Connected operations are derived live from OPERATIONS_ROWS via
 * getReservationsForItem — INVENTORY_RESERVATIONS never duplicates operation/customer data, and
 * this component never trusts a stored `available` (always getAvailableUnits) or a stored total
 * value (always onHand × unitValue).
 *
 * No Recent Activity section: OPERATIONS_ROWS' own activity logs don't have an "inventoryReserved"
 * step for every operation used here (e.g. #10345, #10340), so a uniform stock-activity feed
 * across all 10 items would mean inventing timestamps for some of them. Connected
 * operations/reservations already carries the "inventory → operation → customer" story this
 * stage is about, so Recent Activity is omitted here rather than fabricated.
 */
export default function InventoryDetailContent({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Inventory");
  const tOps = useTranslations("Dashboard.Operations");

  const available = getAvailableUnits(item);
  const stockValue = item.onHand * item.unitValue;
  const reservations = getReservationsForItem(item.id);
  const gap = available - item.reorderPoint;

  const statusNoteKey =
    item.status === "outOfStock"
      ? item.onHand === 0
        ? "outOfStockNoUnits"
        : "outOfStockReserved"
      : item.status;

  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3.5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{item.name}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{item.sku}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[item.status]}`}
            >
              {t(`status.${item.status}`)}
            </span>
            <span className="text-xs text-neutral-500">
              {item.category} · {item.location}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("detail.close")}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
        {/* Stock overview */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.stockOverview")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("table.onHand")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{item.onHand}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.reserved")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{item.reserved}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.available")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{available}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.reorderPoint")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{item.reorderPoint}</p>
            </div>
          </div>
        </div>

        {/* Stock status */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.stockStatus")}
          </p>
          <p className="text-sm text-neutral-600">{t(`detail.statusNote.${statusNoteKey}`)}</p>
        </div>

        {/* Connected operations */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.connectedOperations")}
          </p>
          {reservations.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noReservations")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {reservations.map(({ reservation, operation }) => (
                <div key={reservation.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{operation.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OPERATION_STATUS_TONE[operation.status]}`}
                      >
                        {tOps(`status.${operation.status}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">{operation.customer}</p>
                    <p className="truncate text-xs text-neutral-400">{tOps(`stage.${operation.stage}`)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground">
                      {t("detail.unitsReserved", { count: reservation.quantity })}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {tOps("table.updated")} {operation.updated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Replenishment */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.replenishment")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("table.available")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{available}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.reorderPoint")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{item.reorderPoint}</p>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            {gap >= 0
              ? t("detail.aboveReorderPointBy", { count: gap })
              : t("detail.belowReorderPointBy", { count: -gap })}
          </p>
        </div>

        {/* Value */}
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("table.value")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500">{t("detail.unitValue")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">CHF {item.unitValue.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("detail.stockValue")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">CHF {stockValue.toLocaleString("en-US")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
