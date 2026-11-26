import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ChevronDownIcon, DashboardIcon } from "@/components/dashboard/icons";
import { Link } from "@/i18n/navigation";
import { getCrossModuleScenario, getTotalOutstanding, OPERATIONS_SUMMARY } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{children}</p>;
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

function TraceRow({ icon, moduleLabel, title, statusLabel, statusTone, facts, linkHref, linkLabel }: TraceRowProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-1 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)] @lg:items-center @lg:gap-3 @lg:p-4">
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name={icon} className="h-[18px] w-[18px]" />
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 @lg:block">
          <p className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">{moduleLabel}</p>
          <p className="col-start-1 row-start-2 mt-0.5 text-sm font-semibold break-words text-foreground">{title}</p>
          <span className={`col-start-2 row-start-1 row-span-2 inline-flex w-fit max-w-28 items-center self-start rounded-full px-2 py-0.5 text-[10px] @lg:mt-1.5 font-medium ${statusTone}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 pl-[46px] @lg:flex-col @lg:pl-0">
        {facts.map((fact) => (
          <p key={fact} className="text-xs break-words text-neutral-600">
            {fact}
          </p>
        ))}
      </div>
      <div className="flex min-w-0 items-center justify-end">
        <Link href={linkHref} className="inline-flex min-h-9 items-center gap-1 text-right text-xs font-semibold text-accent hover:underline">
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function TraceConnector() {
  return (
    <div aria-hidden="true" className="flex h-5 flex-col items-center justify-center">
      <span className="h-2.5 w-px bg-accent/30" />
      <ChevronDownIcon className="-mt-1 h-3 w-3 text-accent/60" />
    </div>
  );
}

/**
 * Responsive, read-only cross-module workflow.
 * All records and deep links use the existing shared demo data.
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
      <div className="hidden shrink-0 @5xl:mb-3 @5xl:block">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
        <p className="mt-0.5 text-sm text-neutral-500">{t("leftRightHint")}</p>
      </div>

      {/* Scenario identity — a plain context line, not another card competing with the trace below. */}
      <div className="mb-3 flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-slate-200/70 bg-white px-3 py-2.5 text-sm @lg:px-4">
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
        <div className="flex min-w-0 flex-col">
          <SectionLabel>{t("sections.primaryFlow")}</SectionLabel>
          <div className="flex flex-1 flex-col @5xl:[&>div:not([aria-hidden])]:flex-1">
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
              linkHref={{ pathname: "/demo/inventory", query: { contextItem: inventoryItem.id, from: "scenario" } }}
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
              linkHref={{ pathname: "/demo/finance", query: { contextInvoice: invoice.id, from: "scenario" } }}
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
          <div className="flex flex-1 flex-col gap-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @lg:p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent bg-accent/10">
                  <DashboardIcon name="bolt" className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">{t("steps.automation")}</p>
              </div>
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

            <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @lg:p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-success bg-success/10">
                  <DashboardIcon name="check" className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">{t("steps.approval")}</p>
              </div>
              <div className="mt-1.5 flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold break-words text-foreground">{t("noApprovalRequired")}</p>
                  <p className="mt-0.5 text-xs break-words text-neutral-500">{t("noApprovalExplanation")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @lg:p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent bg-accent/10">
                  <DashboardIcon name="chart" className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">{t("steps.management")}</p>
              </div>
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
