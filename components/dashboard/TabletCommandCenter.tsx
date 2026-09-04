"use client";

import { useEffect, useState } from "react";
import { KPI_ITEMS } from "@/lib/demo-data";
import ApprovalsPanel from "./ApprovalsPanel";
import BusinessPerformance from "./BusinessPerformance";
import KpiCard from "./KpiCard";
import LiveOperations from "./LiveOperations";
import NeedsAttention from "./NeedsAttention";
import TabletNavigation from "./TabletNavigation";
import TabletTopbar from "./TabletTopbar";

export default function TabletCommandCenter() {
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
    <div className="relative hidden min-w-0 flex-1 @lg:flex @5xl:hidden">
      <div className="flex h-full w-full flex-col overflow-y-auto bg-neutral-50 p-4">
        <TabletTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

        <div className="mb-4 grid shrink-0 grid-cols-2 gap-3">
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

        <div className="mb-4 h-80 shrink-0">
          <NeedsAttention />
        </div>

        <div className="mb-4 h-72 shrink-0">
          <BusinessPerformance />
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-3 @3xl:grid-cols-2">
          <div className="h-80">
            <LiveOperations />
          </div>
          <div className="h-64">
            <ApprovalsPanel />
          </div>
        </div>
      </div>

      <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
}
