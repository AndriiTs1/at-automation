"use client";

import { useEffect, useState } from "react";
import { KPI_ITEMS } from "@/lib/demo-data";
import MobileKpiCard from "./MobileKpiCard";
import MobileLiveOperations from "./MobileLiveOperations";
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
      <div className="flex h-full w-full flex-col overflow-hidden bg-demo-background px-3 pt-1 pb-3">
        <MobileTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

        <div className="mb-2 grid shrink-0 grid-cols-2 gap-2">
          {KPI_ITEMS.slice(0, 2).map((item) => (
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

        <div className="min-h-0 flex-1">
          <MobileLiveOperations limit={2} />
        </div>
      </div>

      <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} panelId="mobile-nav-panel" />
    </div>
  );
}
