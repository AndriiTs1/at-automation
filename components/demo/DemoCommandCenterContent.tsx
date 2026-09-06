import { useTranslations } from "next-intl";
import { KPI_ITEMS } from "@/lib/demo-data";
import ApprovalsPanel from "../dashboard/ApprovalsPanel";
import BusinessPerformance from "../dashboard/BusinessPerformance";
import KpiCard from "../dashboard/KpiCard";
import LiveOperations from "../dashboard/LiveOperations";
import MobileApprovalsPanel from "../dashboard/MobileApprovalsPanel";
import MobileBusinessPerformance from "../dashboard/MobileBusinessPerformance";
import MobileKpiCard from "../dashboard/MobileKpiCard";
import MobileLiveOperations from "../dashboard/MobileLiveOperations";
import MobileNeedsAttention from "../dashboard/MobileNeedsAttention";
import NeedsAttention from "../dashboard/NeedsAttention";
import DynamicGreeting from "./DynamicGreeting";

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
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="mb-2.5 shrink-0 @lg:hidden">
        <p className="text-base leading-tight font-semibold text-foreground">
          <DynamicGreeting />
        </p>
        <p className="mt-0.5 text-xs leading-tight text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
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
      <div className="mb-2.5 h-[23rem] shrink-0 @lg:hidden">
        <MobileNeedsAttention />
      </div>
      <div className="mb-2.5 h-60 shrink-0 @lg:hidden">
        <MobileApprovalsPanel />
      </div>
      <div className="mb-2.5 h-80 shrink-0 @lg:hidden">
        <MobileLiveOperations />
      </div>
      <div className="h-56 shrink-0 @lg:hidden">
        <MobileBusinessPerformance />
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden shrink-0 @lg:mb-4 @lg:block @5xl:hidden">
        <p className="text-lg font-semibold text-foreground">
          <DynamicGreeting />
        </p>
        <p className="text-sm text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
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
      <div className="hidden h-80 shrink-0 @lg:mb-4 @lg:block @5xl:hidden">
        <NeedsAttention />
      </div>
      <div className="hidden h-72 shrink-0 @lg:mb-4 @lg:block @5xl:hidden">
        <BusinessPerformance />
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
      <div className="hidden shrink-0 @5xl:mb-3 @5xl:block">
        <p className="text-sm font-normal text-neutral-500">
          <DynamicGreeting />
        </p>
        <p className="text-sm text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
      </div>
      <div className="hidden shrink-0 grid-cols-2 gap-2 @5xl:mb-3 @5xl:grid @3xl:grid-cols-4 @3xl:gap-3">
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
      <div className="hidden gap-2.5 @5xl:grid @5xl:min-h-0 @5xl:flex-1 @5xl:grid-rows-[4fr_3fr] @5xl:gap-3">
        <div className="grid grid-cols-1 gap-2.5 @5xl:min-h-0 @5xl:grid-cols-[65fr_35fr] @5xl:gap-3">
          <div className="h-full min-h-0">
            <BusinessPerformance />
          </div>
          <div className="h-full min-h-0">
            <NeedsAttention />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 @5xl:min-h-0 @5xl:grid-cols-[65fr_35fr] @5xl:gap-3">
          <div className="h-full min-h-0">
            <LiveOperations />
          </div>
          <div className="h-full min-h-0">
            <ApprovalsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
