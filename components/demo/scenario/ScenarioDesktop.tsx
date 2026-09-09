import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ChevronDownIcon, DashboardIcon } from "@/components/dashboard/icons";
import { Link } from "@/i18n/navigation";
import { getCrossModuleScenario, getTotalOutstanding, OPERATIONS_SUMMARY } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">{children}</p>;
}

function StatusBadge({ tone, children }: { tone: "accent" | "error" | "success"; children: ReactNode }) {
  const toneClass = tone === "accent" ? "bg-accent/10 text-accent" : tone === "error" ? "bg-error/10 text-error" : "bg-success/10 text-success";
  return <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass}`}>{children}</span>;
}

// Same tone conventions each source module already uses for this exact status field (Customers'
// HEALTH_TONE, OperationsTable's STATUS_TONE, InventoryTable's STATUS_TONE, FinanceTable's
// STATUS_TONE) — the trace's status pills must read identically to the module they came from.
const CUSTOMER_HEALTH_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  watch: "bg-warning/10 text-warning",
  atRisk: "bg-error/10 text-error",
};
const OPERATION_STATUS_TONE: Record<string, string> = {
  inProgress: "bg-accent/10 text-accent",
  waiting: "bg-warning/10 text-warning",
  attention: "bg-error/10 text-error",
  completed: "bg-success/10 text-success",
};
const INVENTORY_STATUS_TONE: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  low: "bg-warning/10 text-warning",
  critical: "bg-error/10 text-error",
  outOfStock: "bg-neutral-200 text-neutral-600",
};
// Solid-fill counterpart of INVENTORY_STATUS_TONE above, used only for the small status dot inside
// the Automation card that echoes this item's real status (see the Automation block below) — same
// tone semantics as the Inventory row's own pill, not a new color system.
const INVENTORY_STATUS_DOT: Record<string, string> = {
  healthy: "bg-success",
  low: "bg-warning",
  critical: "bg-error",
  outOfStock: "bg-neutral-400",
};
const FINANCE_STATUS_TONE: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-600",
  sent: "bg-accent/10 text-accent",
  overdue: "bg-error/10 text-error",
  paid: "bg-success/10 text-success",
};

type TraceRowProps = {
  icon: string;
  moduleLabel: string;
  title: string;
  statusLabel: string;
  statusTone: string;
  facts: string[];
  linkHref: { pathname: "/demo/customers" | "/demo/operations" | "/demo/inventory" | "/demo/finance"; query: Record<string, string> };
  linkLabel: string;
};

/**
 * One compact business-object record — a three-zone card (identity / context / action), not a
 * flat three-column text row. The identity zone carries the same small icon glyph its own module
 * uses in the sidebar (users/activity/box/coins) plus that module's own status pill, so each
 * record is recognizable at a glance without colored tiles or a new icon set. A hairline divider
 * separates each zone so the eye reads "one record with parts," not a table row.
 */
function TraceRow({ icon, moduleLabel, title, statusLabel, statusTone, facts, linkHref, linkLabel }: TraceRowProps) {
  return (
    <div className="flex flex-col items-stretch rounded-xl border border-border bg-surface shadow-sm shadow-black/5 @5xl:flex-row">
      <div className="flex items-start gap-2.5 border-b border-border/70 p-3.5 @5xl:w-56 @5xl:shrink-0 @5xl:border-r @5xl:border-b-0">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
          <DashboardIcon name={icon} className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">{moduleLabel}</p>
          <p className="mt-0.5 text-sm font-semibold break-words text-foreground">{title}</p>
          <span className={`mt-1.5 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusTone}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3">
        {facts.map((fact) => (
          <p key={fact} className="text-xs break-words text-neutral-600">
            {fact}
          </p>
        ))}
      </div>
      <div className="flex items-center border-t border-border/70 px-3.5 py-2.5 @5xl:w-56 @5xl:justify-center @5xl:border-t-0 @5xl:border-l @5xl:py-0">
        <Link href={linkHref} className="text-xs font-medium text-accent hover:underline @5xl:text-center">
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/** A short vertical line ending in a small chevron, aligned under each row's icon chip (28px in —
 * matching the chip's own center) so the connector visibly originates from each record's identity
 * area rather than floating between two generic boxes. */
function TraceConnector() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center pl-7">
      <span className="h-2.5 w-px bg-neutral-300" />
      <ChevronDownIcon className="-mt-1 h-3 w-3 text-neutral-300" />
    </div>
  );
}

/**
 * Cross-module scenario trace (Stage 2J.1, restructured 2J.1A, finalized 2J.2, visually
 * polished 2J.2B/C). Not a business module: no selection state, no filters, no actions — a
 * guided, read-only trace through getCrossModuleScenario(), which resolves every fact live
 * from CUSTOMERS_ROWS/OPERATIONS_ROWS/INVENTORY_ROWS/FINANCE_INVOICES/AUTOMATION_DEFINITIONS.
 * Nothing here is a re-typed literal.
 *
 * Renders at every breakpoint (fixed in a later stage — this component originally rendered
 * nothing below @5xl, matching every other module's own desktop-foundation stage; but once
 * Command Center's "See connected workflow" entry point became reachable from mobile/tablet
 * too, that left a real dead end: tapping it landed on a page with an empty body below the
 * topbar). Below @5xl the trace and the two blocks it's built from collapse to a single
 * column — same content, same tokens, same hierarchy, just stacked instead of side-by-side:
 *   - The outer grid is `grid-cols-1 @5xl:grid-cols-[65fr_35fr]`.
 *   - Each TraceRow is `flex-col @5xl:flex-row` (identity zone on top, then facts, then the
 *     "View X" action, each full-width) instead of a fixed `w-56` left column that would
 *     overflow a ~360px mobile content width.
 * At @5xl+ every class above reduces to the exact same unconditional value this component
 * shipped with before, so the desktop composition is unchanged.
 *
 * Two-column operational trace at @5xl+ (2J.2, layout unchanged in 2J.2B — only the card visual
 * system, connectors and right-column grouping were redesigned):
 *   LEFT (~65%) "Business trace" — Customer → Operation → Inventory → Finance as four compact
 *     three-zone records (identity / context / action) connected by a restrained vertical
 *     connector that starts under each record's own icon chip.
 *   RIGHT (~35%) "AT control & visibility" — held together by a single left-hand accent spine
 *     (not a bulky wrapping card) so Automation / Approval / Management read as one AT layer:
 *     Automation stays the strongest block and cross-references Inventory's own icon+name rather
 *     than drawing a line from Finance or the operation; Approval is a plain, borderless surface
 *     (deliberately lighter than the two bordered cards) reporting a state, not a workflow record;
 *     Management is the closing "Contributes to" summary.
 *
 * Every "View X" link is a REAL record-level deep link (query param + the target module's own
 * existing detail UI — see useQuerySelection and each Workspace's own deep-link handling), not a
 * generic module link — clicking it lands directly on this exact customer/operation/item/invoice/
 * automation, not just "the module."
 */
export default function ScenarioDesktop() {
  const t = useTranslations("Dashboard.Scenario");
  const tCustomers = useTranslations("Dashboard.Customers");
  const tOperations = useTranslations("Dashboard.Operations");
  const tInventory = useTranslations("Dashboard.Inventory");
  const tFinance = useTranslations("Dashboard.Finance");
  const tAutomations = useTranslations("Dashboard.Automations");
  const tKpi = useTranslations("Dashboard.Kpi");
  const tReports = useTranslations("Dashboard.Reports");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const scenario = getCrossModuleScenario();
  if (!scenario) return null;

  const { customer, operation, inventoryItem, reservedQuantity, invoice, invoiceOutstanding, automation } = scenario;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Page header — no greeting: that belongs only to Command Center. */}
      <div className="mb-1 shrink-0">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        <p className="mt-0.5 text-sm text-neutral-500">{t("leftRightHint")}</p>
      </div>

      {/* Scenario identity — a plain context line, not another card competing with the trace below. */}
      <div className="mb-4 flex shrink-0 items-center gap-2 text-sm">
        <span className="font-semibold text-foreground">{customer.name}</span>
        <span aria-hidden="true" className="text-neutral-300">
          ·
        </span>
        <span className="text-neutral-500">
          {t("steps.operation")} {operation.id}
        </span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 @5xl:grid-cols-[65fr_35fr]">
        {/* LEFT — Business trace: the real sequential chain, three-zone records, not narrow tiles. */}
        <div className="min-w-0">
          <SectionLabel>{t("sections.primaryFlow")}</SectionLabel>
          <div className="flex flex-col">
            <TraceRow
              icon="users"
              moduleLabel={t("steps.customer")}
              title={customer.name}
              statusLabel={tCustomers(`health.${customer.health}`)}
              statusTone={CUSTOMER_HEALTH_TONE[customer.health]}
              facts={[tCustomers(`segment.${customer.segment}`), t("ownerLabel", { name: customer.owner })]}
              linkHref={{ pathname: "/demo/customers", query: { contextCustomer: customer.id, from: "scenario" } }}
              linkLabel={t("viewCustomer")}
            />
            <TraceConnector />
            <TraceRow
              icon="activity"
              moduleLabel={t("steps.operation")}
              title={operation.id}
              statusLabel={tOperations(`status.${operation.status}`)}
              statusTone={OPERATION_STATUS_TONE[operation.status]}
              facts={[tOperations(`stage.${operation.stage}`), operation.value]}
              linkHref={{ pathname: "/demo/operations", query: { operation: operation.id, from: "scenario" } }}
              linkLabel={t("viewOperation")}
            />
            <TraceConnector />
            <TraceRow
              icon="box"
              moduleLabel={t("steps.inventory")}
              title={inventoryItem.name}
              statusLabel={tInventory(`status.${inventoryItem.status}`)}
              statusTone={INVENTORY_STATUS_TONE[inventoryItem.status]}
              facts={[
                t("reservedFor", { count: reservedQuantity, operationId: operation.id }),
                t("onHandAt", { count: inventoryItem.onHand, location: inventoryItem.location }),
              ]}
              linkHref={{ pathname: "/demo/inventory", query: { item: inventoryItem.id, from: "scenario" } }}
              linkLabel={t("viewInventoryItem")}
            />
            <TraceConnector />
            <TraceRow
              icon="coins"
              moduleLabel={t("steps.finance")}
              title={invoice.id}
              statusLabel={tFinance(`status.${invoice.status}`)}
              statusTone={FINANCE_STATUS_TONE[invoice.status]}
              facts={[t("outstandingAmount", { amount: formatChf(invoiceOutstanding) }), t("dueDate", { date: invoice.dueDate })]}
              linkHref={{ pathname: "/demo/finance", query: { invoice: invoice.id, from: "scenario" } }}
              linkLabel={t("viewInvoice")}
            />
          </div>
        </div>

        {/* RIGHT — AT control & visibility: one accent spine ties Automation/Approval/Management
            into a single AT layer instead of three unrelated blocks. The column stretches to the
            left trace's own height (grid items-stretch above) and Management is the one block
            that grows into any leftover space (flex-1), so the two columns terminate at
            approximately the same level without artificially padding Automation/Approval or
            forcing a false 1:1 card alignment with the left trace. */}
        <div className="flex min-w-0 flex-col">
          <SectionLabel>{t("sections.controlLayer")}</SectionLabel>
          <div className="flex flex-1 flex-col gap-3 border-l-2 border-border pl-3.5">
            <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm shadow-black/5">
              <p className="text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">{t("steps.automation")}</p>
              <p className="mt-1 text-sm font-semibold break-words text-foreground">
                {tAutomations(`definitions.${automation.key}.name`)}
              </p>
              <div className="mt-1.5">
                <StatusBadge tone="success">{tAutomations(`status.${automation.status}`)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs break-words text-neutral-600">
                {tAutomations(`definitions.${automation.key}.trigger`)}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${INVENTORY_STATUS_DOT[inventoryItem.status]}`}
                />
                <p className="text-xs break-words text-neutral-500">
                  {t("automationTrigger", { item: inventoryItem.name, status: tInventory(`status.${inventoryItem.status}`) })}
                </p>
              </div>
              <Link
                href={{ pathname: "/demo/automations", query: { automation: automation.id, from: "scenario" } }}
                className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
              >
                {t("viewAutomation")} <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-lg bg-neutral-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">{t("steps.approval")}</p>
              <div className="mt-1.5 flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold break-words text-foreground">{t("noApprovalRequired")}</p>
                  <p className="mt-0.5 text-xs break-words text-neutral-500">{t("noApprovalExplanation")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-xl border border-border bg-surface p-3.5 shadow-sm shadow-black/5">
              <p className="text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">{t("steps.management")}</p>
              <p className="mt-1.5 text-[10px] font-medium tracking-wide text-neutral-400 uppercase">{t("companyContext")}</p>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] break-words text-neutral-500">{tKpi("items.openOperations")}</p>
                  <p className="text-base font-bold text-foreground">{OPERATIONS_SUMMARY.active}</p>
                </div>
                <div>
                  <p className="text-[11px] break-words text-neutral-500">{tReports("kpi.outstandingReceivables")}</p>
                  <p className="text-base font-bold text-foreground">{formatChf(getTotalOutstanding())}</p>
                </div>
              </div>
              <Link href="/demo/reports" className="mt-2 inline-block text-xs font-medium text-accent hover:underline">
                {t("openModule", { module: tSidebar("items.reports") })} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
