import { useTranslations } from "next-intl";
import DynamicGreeting from "@/components/demo/DynamicGreeting";
import { KPI_ITEMS } from "@/lib/demo-data";
import AutomationImpact from "./AutomationImpact";
import BusinessPerformanceCompact from "./BusinessPerformanceCompact";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import KpiCard from "./KpiCard";
import LiveOperations from "./LiveOperations";
import MobileCommandCenter from "./MobileCommandCenter";
import NeedsAttention from "./NeedsAttention";
import OperationsStatusCard from "./OperationsStatusCard";
import TabletCommandCenter from "./TabletCommandCenter";

function KpiGrid() {
  return (
    <>
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
    </>
  );
}

export default function DemoDashboard() {
  const t = useTranslations("Dashboard");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="@container flex h-full w-full">
      {/* MOBILE — container below @lg (512px). Dedicated mobile workspace. */}
      <MobileCommandCenter />

      {/* TABLET — @lg to below @5xl (512px–1024px container). Dedicated tablet workspace. */}
      <TabletCommandCenter />

      {/*
        DESKTOP — @5xl and up (1024px+ container). A representative subset of the real /demo
        Command Center (see DemoCommandCenterContent.tsx), not a full reproduction: header +
        4-KPI row + 3 of the 4 executive analytics cards + one operational panel (Live Operations,
        chosen over Needs Attention/Approvals for this decorative preview because it reads as the
        product actively doing something, not surfacing problems).

        Only 3 executive cards (Business Performance, Automation Impact, Operations Status), not
        all 4: this frame's own max-w-[1200px] gives each card meaningfully less width than the
        real /demo's desktop columns, and Automation Impact's 4-category bar labels were
        truncating past legibility ("Opera...", "Custo...") at a 4-up width. Dropping Action
        Required — whose "list of items" pattern is already covered by Live Operations below —
        gives the remaining three real breathing room instead of cramming a fourth card in.
        Deliberately does NOT reuse the real /demo's two-row-of-paired-cards geometry either —
        pairing BusinessPerformanceCompact with a taller sibling in a stretched grid cell is
        exactly the oversized-empty-cell bug fixed in the real Command Center; every card here
        gets its own explicit, content-matched height instead.

        Live Operations is nested behind `@6xl` (≥1152px container), one step past this tier's own
        @5xl entry point (1024px): this frame's height is hard-capped at width × 0.625 (TabletFrame's
        fixed 16:10 aspect-ratio + overflow-hidden), and at the low end of the @5xl range there
        isn't reliably enough of that budget left, after the header/KPI/executive rows above, to
        add a ~288px panel without risking it being clipped by the frame rather than scrolling.
      */}
      <div className="hidden w-full @5xl:flex">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-demo-background p-3 @lg:p-4 @3xl:p-2.5">
          <DashboardTopbar />

          <div className="mb-2 shrink-0">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
            <p className="text-sm text-slate-500">
              <DynamicGreeting /> · {tTopbar("attentionCount", { count: 3 })}
            </p>
          </div>

          <div className="mb-3 grid shrink-0 grid-cols-4 gap-3">
            <KpiGrid />
          </div>

          <div className="mb-3 grid shrink-0 grid-cols-3 gap-3">
            <div className="h-44">
              <BusinessPerformanceCompact />
            </div>
            <div className="h-44">
              <AutomationImpact />
            </div>
            <div className="h-44">
              <OperationsStatusCard />
            </div>
          </div>

          <div className="hidden h-72 shrink-0 gap-3 @6xl:flex">
            <div className="min-w-0 flex-[2]">
              <LiveOperations />
            </div>
            <div className="min-w-0 flex-1">
              <NeedsAttention />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
