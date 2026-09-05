"use client";

import { useEffect, useState } from "react";
import { KPI_ITEMS } from "@/lib/demo-data";
import MobileApprovalsPanel from "./MobileApprovalsPanel";
import MobileBusinessPerformance from "./MobileBusinessPerformance";
import MobileKpiCard from "./MobileKpiCard";
import MobileLiveOperations from "./MobileLiveOperations";
import MobileNeedsAttention from "./MobileNeedsAttention";
import MobileTopbar from "./MobileTopbar";
import TabletNavigation from "./TabletNavigation";

export default function MobileCommandCenter() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navOpen]);

  return (
    <div className="relative flex min-w-0 flex-1 @lg:hidden">
      <div className="flex h-full w-full flex-col overflow-y-auto bg-neutral-50 px-3 pt-1 pb-3">
        <MobileTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

        <div className="mb-2.5 grid shrink-0 grid-cols-2 gap-2">
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

        <div className="mb-2.5 h-[23rem] shrink-0">
          <MobileNeedsAttention />
        </div>

        <div className="mb-2.5 h-60 shrink-0">
          <MobileApprovalsPanel />
        </div>

        <div className="mb-2.5 h-80 shrink-0">
          <MobileLiveOperations />
        </div>

        <div className="h-56 shrink-0">
          <MobileBusinessPerformance />
        </div>
      </div>

      <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} panelId="mobile-nav-panel" />
    </div>
  );
}
