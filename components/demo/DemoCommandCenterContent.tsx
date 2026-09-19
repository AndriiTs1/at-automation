import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KPI_ITEMS } from "@/lib/demo-data";
import ActionRequired from "../dashboard/ActionRequired";
import ApprovalsPanel from "../dashboard/ApprovalsPanel";
import AutomationImpact from "../dashboard/AutomationImpact";
import BusinessPerformanceCompact from "../dashboard/BusinessPerformanceCompact";
import { DashboardIcon } from "../dashboard/icons";
import KpiCard from "../dashboard/KpiCard";
import LiveOperations from "../dashboard/LiveOperations";
import MobileApprovalsPanel from "../dashboard/MobileApprovalsPanel";
import MobileKpiCard from "../dashboard/MobileKpiCard";
import MobileLiveOperations from "../dashboard/MobileLiveOperations";
import MobileNeedsAttention from "../dashboard/MobileNeedsAttention";
import NeedsAttention from "../dashboard/NeedsAttention";
import OperationsStatusCard from "../dashboard/OperationsStatusCard";
import DynamicGreeting from "./DynamicGreeting";

/**
 * Compact secondary "action chip" entry point to the guided Scenario trace — a bordered
 * surface pill (not a filled primary CTA) so it reads as clickable and intentional without
 * competing with Command Center's own primary content. Reused as-is across all three
 * breakpoints; only the surrounding block's margin/text-size adapts per breakpoint, so this
 * single implementation can't visually drift between mobile/tablet/desktop.
 */
function ScenarioEntryLink({ className = "" }: { className?: string }) {
  const tScenario = useTranslations("Dashboard.Scenario");
  return (
    <Link
      href="/demo/scenario"
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 font-medium text-slate-900 shadow-demo-card transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none ${className}`}
    >
      <DashboardIcon name="activity" className="h-3.5 w-3.5 shrink-0 text-accent" />
      <span>{tScenario("entryPoint")}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/**
 * Director Command Center workspace content — inserted via {children} into each of
 * DemoAppShell's three breakpoint slots. Each block below carries its own container-query
 * visibility (mirroring the gating that used to live on MobileCommandCenter/TabletCommandCenter/
 * DemoDashboard's outer wrappers), so only the block matching the current shell slot renders.
 *
 * The personalized greeting + attention-count line is owned here (Command Center only) rather
 * than by the shared topbars — it used to live in DashboardTopbar/TabletTopbar/MobileTopbar,
 * which meant it rendered on every module page. DynamicGreeting resolves the actual "morning/
 * afternoon/evening/welcomeBack" text client-side from local browser time; attentionCount stays
 * a plain server-renderable translation since it doesn't depend on the client clock.
 */
export default function DemoCommandCenterContent() {
  const t = useTranslations("Dashboard");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="mb-2.5 shrink-0 @lg:hidden">
        <h1 className="text-base leading-tight font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
        <p className="mt-0.5 text-xs leading-tight text-slate-500">
          <DynamicGreeting /> · {tTopbar("attentionCount", { count: 3 })}
        </p>
        <ScenarioEntryLink className="mt-2 text-xs" />
      </div>
      <div className="mb-2.5 grid shrink-0 grid-cols-2 gap-2 @lg:hidden">
        {KPI_ITEMS.map((item) => (
          <MobileKpiCard
            key={item.key}
            itemKey={item.key}
            value={item.value}
            deltaKind={item.deltaKind}
            deltaValue={"deltaValue" in item ? item.deltaValue : undefined}
            deltaCount={"deltaCount" in item ? item.deltaCount : undefined}
            deltaHours={"deltaHours" in item ? item.deltaHours : undefined}
            tone={item.tone}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="mb-2.5 grid shrink-0 grid-cols-1 gap-2 @lg:hidden">
        <div className="h-40">
          <BusinessPerformanceCompact />
        </div>
        <div className="h-40">
          <AutomationImpact />
        </div>
        <div className="h-40">
          <OperationsStatusCard />
        </div>
        <div className="h-40">
          <ActionRequired />
        </div>
      </div>
      <div className="mb-2.5 h-[23rem] shrink-0 @lg:hidden">
        <MobileNeedsAttention />
      </div>
      <div className="mb-2.5 h-60 shrink-0 @lg:hidden">
        <MobileApprovalsPanel />
      </div>
      <div className="h-80 shrink-0 @lg:hidden">
        <MobileLiveOperations />
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden shrink-0 @lg:mb-4 @lg:block @5xl:hidden">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
        <p className="text-sm text-slate-500">
          <DynamicGreeting /> · {tTopbar("attentionCount", { count: 3 })}
        </p>
        <ScenarioEntryLink className="mt-2 text-sm" />
      </div>
      <div className="hidden shrink-0 grid-cols-2 gap-3 @lg:mb-4 @lg:grid @5xl:hidden">
        {KPI_ITEMS.map((item) => (
          <KpiCard
            key={item.key}
            itemKey={item.key}
            value={item.value}
            deltaKind={item.deltaKind}
            deltaValue={"deltaValue" in item ? item.deltaValue : undefined}
            deltaCount={"deltaCount" in item ? item.deltaCount : undefined}
            deltaHours={"deltaHours" in item ? item.deltaHours : undefined}
            tone={item.tone}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="hidden shrink-0 grid-cols-2 gap-3 @lg:mb-4 @lg:grid @5xl:hidden">
        <div className="h-44">
          <BusinessPerformanceCompact />
        </div>
        <div className="h-44">
          <AutomationImpact />
        </div>
        <div className="h-44">
          <OperationsStatusCard />
        </div>
        <div className="h-44">
          <ActionRequired />
        </div>
      </div>
      <div className="hidden h-80 shrink-0 @lg:mb-4 @lg:block @5xl:hidden">
        <NeedsAttention />
      </div>
      <div className="hidden shrink-0 grid-cols-1 gap-3 @lg:grid @3xl:grid-cols-2 @5xl:hidden">
        <div className="h-80">
          <LiveOperations />
        </div>
        <div className="h-64">
          <ApprovalsPanel />
        </div>
      </div>

      {/* Desktop workspace (@5xl and up) */}
      <div className="hidden shrink-0 @5xl:mb-1.5 @5xl:block">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
        <div className="mt-0.5 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            <DynamicGreeting /> · {tTopbar("attentionCount", { count: 3 })}
          </p>
          <ScenarioEntryLink className="text-sm" />
        </div>
      </div>
      <div className="hidden shrink-0 grid-cols-2 gap-2 @5xl:mb-1.5 @5xl:grid @3xl:grid-cols-4 @3xl:gap-3">
        {KPI_ITEMS.map((item) => (
          <KpiCard
            key={item.key}
            itemKey={item.key}
            value={item.value}
            deltaKind={item.deltaKind}
            deltaValue={"deltaValue" in item ? item.deltaValue : undefined}
            deltaCount={"deltaCount" in item ? item.deltaCount : undefined}
            deltaHours={"deltaHours" in item ? item.deltaHours : undefined}
            tone={item.tone}
            icon={item.icon}
          />
        ))}
      </div>
      {/*
        Executive analytics row (Germes four-card row concept, AT content) — a fixed, modest
        height shared by all four cards, matching Germes' own AnalyticsCard convention of a fixed
        row height for compact executive tiles rather than letting them stretch. Sits between the
        KPI strip and the deeper operational layer below.
      */}
      <div className="hidden shrink-0 @5xl:mb-3 @5xl:grid @5xl:grid-cols-4 @5xl:gap-3">
        <div className="h-44">
          <BusinessPerformanceCompact />
        </div>
        <div className="h-44">
          <AutomationImpact />
        </div>
        <div className="h-44">
          <OperationsStatusCard />
        </div>
        <div className="h-44">
          <ActionRequired />
        </div>
      </div>
      {/*
        Operational/detail layer — Needs Attention, Live Operations, Approvals now share one row
        of three columns (Business Performance moved up into the executive row above). Weighted
        1.2fr/1.1fr/1fr toward Needs Attention/Live Operations' denser per-row content.

        Back to a plain CSS Grid row (no explicit height, no `flex-1`/`min-h-0` on the row itself,
        no `items-start`) — this is deliberate and distinct from two earlier, now-corrected
        attempts:
          1. The original bug was this row's *outer* wrapper being `@5xl:flex-1` inside a
             `grid-rows-[5fr_4fr]` block, forcing the whole row to stretch to fill all remaining
             viewport height — that's what made Approvals' empty area huge. The fix for that is
             simply never giving the row itself a height instruction beyond its own content.
          2. A later pass over-corrected by switching this row to `flex` + `items-start` specifically
             to stop cards from matching each other's height at all (each card's own `h-full` was
             then sized off its OWN content). That solved the viewport-stretch bug but introduced a
             new one: three different card heights with mismatched bottom edges.
        Grid's *default* `align-items: stretch` is exactly the right tool for what's wanted now:
        auto-row-sizing measures each card's own natural (un-stretched) content height to size the
        row — i.e. the row becomes exactly as tall as Needs Attention (the tallest) naturally is,
        never taller, never viewport-filling — and then, by the same default stretch behavior,
        Live Operations and Approvals are stretched to that one shared height via their own
        existing `h-full`. Approvals' internal `flex-1` item list + `shrink-0` footer (unchanged)
        naturally pushes "N awaiting approval" to the bottom of the taller card instead of leaving
        it stranded mid-card. No internal scrolling is introduced: every card still shows all of
        its records; the extra height is inert whitespace within Approvals'/Live Operations' own
        already-`overflow-y-auto` list, which never actually needs to scroll since it's now taller
        than its content, not shorter.
      */}
      <div className="hidden gap-3 @5xl:grid @5xl:grid-cols-[1.2fr_1.1fr_1fr]">
        <NeedsAttention />
        <LiveOperations />
        <ApprovalsPanel />
      </div>
    </>
  );
}
