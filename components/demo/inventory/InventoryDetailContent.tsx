import { useTranslations } from "next-intl";
import { CloseIcon } from "@/components/dashboard/icons";
import ScenarioReturnLink from "@/components/demo/scenario/ScenarioReturnLink";
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
 * Shared Inventory Detail body — now the mobile/tablet full-screen surface exclusively
 * (InventoryDetailMobile's sole consumer; the desktop 420px inspector uses
 * InventoryInspectorHeader/InventoryInspectorBody below instead, via DetailInspectorShell).
 *
 * Deliberately a literal visual mirror of CustomerDetailContent's mobile markup (uppercase
 * section-label treatment, bordered/divided related-record card, header border-b, identical
 * spacing scale: p-4 header/body, mb-6 between plain sections, mb-7 before the bordered list,
 * mt-1/mt-2 internal rhythm, gap-4 grids) — same visual system, not a new one, per the approved
 * direction that Inventory mobile must reproduce Customers mobile as closely as possible. Content
 * mapping: Account overview → Stock overview (Owner/Open operations → On hand/Reserved); Account
 * health → Stock status; Related operations → Connected operations (same bordered-card row
 * treatment); Commercial → Replenishment (Revenue/Outstanding → Available/Reorder point, same
 * note-line-below pattern). Value is an additional Inventory-only section appended last, styled
 * identically to the other plain-grid sections — Customers has no equivalent field group.
 *
 * Connected operations are derived live from OPERATIONS_ROWS via getReservationsForItem —
 * INVENTORY_RESERVATIONS never duplicates operation/customer data, and this component never
 * trusts a stored `available` (always getAvailableUnits) or a stored total value (always
 * onHand × unitValue).
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
      <ScenarioReturnLink />
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{item.name}</p>
          <p className="mt-1 text-xs text-neutral-400">{item.sku}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[item.status]}`}
            >
              {t(`status.${item.status}`)}
            </span>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-500">
              {item.category}
            </span>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-500">
              {item.location}
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

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {/* Stock overview */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.stockOverview")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500">{t("table.onHand")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{item.onHand}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.reserved")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{item.reserved}</p>
            </div>
          </div>
        </div>

        {/* Stock status */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.stockStatus")}
          </p>
          <p className="text-sm text-neutral-600">{t(`detail.statusNote.${statusNoteKey}`)}</p>
        </div>

        {/* Connected operations */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.connectedOperations")}
          </p>
          {reservations.length === 0 ? (
            <p className="text-sm text-neutral-400">{t("detail.noReservations")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {reservations.map(({ reservation, operation }) => (
                <div key={reservation.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{operation.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OPERATION_STATUS_TONE[operation.status]}`}
                      >
                        {tOps(`status.${operation.status}`)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-neutral-500">{operation.customer}</p>
                    <p className="truncate text-xs text-neutral-400">{tOps(`stage.${operation.stage}`)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground">
                      {t("detail.unitsReserved", { count: reservation.quantity })}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {tOps("table.updated")} {operation.updated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Replenishment */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("detail.replenishment")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500">{t("table.available")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{available}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("table.reorderPoint")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{item.reorderPoint}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {gap >= 0
              ? t("detail.aboveReorderPointBy", { count: gap })
              : t("detail.belowReorderPointBy", { count: -gap })}
          </p>
        </div>

        {/* Value */}
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{t("table.value")}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500">{t("detail.unitValue")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">CHF {item.unitValue.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{t("detail.stockValue")}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">CHF {stockValue.toLocaleString("en-US")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Status → small status-dot color, reusing the same success/warning/error/neutral tokens
 * STATUS_TONE already uses for the (now-retired-on-desktop) badge — never a new color. */
const STATUS_DOT: Record<string, string> = {
  healthy: "bg-success",
  low: "bg-warning",
  critical: "bg-error",
  outOfStock: "bg-neutral-400",
};

/**
 * Desktop inspector header (DetailInspectorShell reference migration). Composed directly by
 * InventoryDetailPanel into the shell's `header` slot; intentionally NOT part of the default
 * InventoryDetailContent export above, which stays untouched and keeps serving the mobile/tablet
 * full-screen overlay exactly as before. Plain text status line (no colored pill) per the
 * approved Customers direction — item name is dominant, status/category/location are a quiet
 * supporting line, not a second visual weight competing with it. category/location stay
 * un-translated, matching the default export's own treatment of them as plain data strings.
 */
export function InventoryInspectorHeader({ item }: { item: InventoryItem }) {
  const t = useTranslations("Dashboard.Inventory");
  return (
    <>
      <p className="truncate text-lg font-semibold text-foreground">{item.name}</p>
      <p className="mt-0.5 text-xs text-neutral-400">{item.sku}</p>
      <p className="mt-1.5 text-xs text-neutral-500">
        {t(`status.${item.status}`)} · {item.category} · {item.location}
      </p>
    </>
  );
}

/**
 * Desktop inspector body. Composed directly by InventoryDetailPanel into the shell's `children`
 * slot — same underlying facts/data helpers as the default export above (nothing new is computed
 * or fetched), reorganized per the approved Customers direction: Stock overview collapses from a
 * labeled block into one unlabeled 2×2 grid; Stock status collapses from a labeled block into one
 * quiet dot + sentence; Connected operations loses its nested `rounded-lg border` box in favor of
 * plain hover-able rows separated only by a light divider. Replenishment and Value keep compact,
 * un-uppercased section labels (they're still distinct fact groups worth naming) but lose their
 * uppercase/tracking-wide treatment and any card wrapper.
 */
export function InventoryInspectorBody({ item }: { item: InventoryItem }) {
  const t = useTranslations("Dashboard.Inventory");
  const tOps = useTranslations("Dashboard.Operations");

  const available = getAvailableUnits(item);
  const stockValue = item.onHand * item.unitValue;
  const reservations = getReservationsForItem(item.id);
  const gap = available - item.reorderPoint;

  const statusNoteKey =
    item.status === "outOfStock" ? (item.onHand === 0 ? "outOfStockNoUnits" : "outOfStockReserved") : item.status;

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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

      <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-600">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} aria-hidden="true" />
        {t(`detail.statusNote.${statusNoteKey}`)}
      </p>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold text-neutral-500">{t("detail.connectedOperations")}</p>
        {reservations.length === 0 ? (
          <p className="text-sm text-neutral-400">{t("detail.noReservations")}</p>
        ) : (
          <div className="divide-y divide-border/70">
            {reservations.map(({ reservation, operation }) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-black/[0.02]"
              >
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

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold text-neutral-500">{t("detail.replenishment")}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
          {gap >= 0 ? t("detail.aboveReorderPointBy", { count: gap }) : t("detail.belowReorderPointBy", { count: -gap })}
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold text-neutral-500">{t("table.value")}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
    </>
  );
}
