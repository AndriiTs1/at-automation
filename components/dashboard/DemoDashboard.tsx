import { useTranslations } from "next-intl";
import DynamicGreeting from "@/components/demo/DynamicGreeting";
import { KPI_ITEMS } from "@/lib/demo-data";
import ApprovalsPanel from "./ApprovalsPanel";
import BusinessPerformance from "./BusinessPerformance";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import KpiCard from "./KpiCard";
import LiveOperations from "./LiveOperations";
import MobileCommandCenter from "./MobileCommandCenter";
import NeedsAttention from "./NeedsAttention";
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
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="@container flex h-full w-full">
      {/* MOBILE — container below @lg (512px). Dedicated mobile workspace. */}
      <MobileCommandCenter />

      {/* TABLET — @lg to below @5xl (512px–1024px container). Dedicated tablet workspace. */}
      <TabletCommandCenter />

      {/* DESKTOP — @5xl and up (1024px+ container). Approved & frozen. */}
      <div className="hidden w-full @5xl:flex">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-neutral-50 p-3 @lg:p-4 @3xl:p-2.5">
          <DashboardTopbar />

          <div className="mb-3 shrink-0 @3xl:mb-2">
            <p className="text-sm font-normal text-neutral-500">
              <DynamicGreeting />
            </p>
            <p className="text-sm text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
          </div>

          <div className="mb-3 grid shrink-0 grid-cols-2 gap-2 @3xl:mb-2 @3xl:grid-cols-4 @3xl:gap-3">
            <KpiGrid />
          </div>

          <div className="grid gap-2.5 @5xl:min-h-0 @5xl:flex-1 @5xl:grid-rows-[4fr_3fr] @5xl:gap-3">
            <div className="grid grid-cols-1 gap-2.5 @5xl:min-h-0 @5xl:grid-cols-[65fr_35fr] @5xl:gap-3">
              <div className="h-56 @lg:h-64 @3xl:h-72 @5xl:h-full @5xl:min-h-0">
                <BusinessPerformance />
              </div>
              <div className="h-60 @lg:h-[19.5rem] @5xl:h-full @5xl:min-h-0">
                <NeedsAttention />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 @5xl:min-h-0 @5xl:grid-cols-[65fr_35fr] @5xl:gap-3">
              <div className="h-64 @lg:h-64 @5xl:h-full @5xl:min-h-0">
                <LiveOperations />
              </div>
              <div className="h-64 @lg:h-60 @5xl:h-full @5xl:min-h-0">
                <ApprovalsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
