"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DynamicGreeting from "@/components/demo/DynamicGreeting";
import { KPI_ITEMS } from "@/lib/demo-data";
import AutomationImpact from "./AutomationImpact";
import BusinessPerformanceCompact from "./BusinessPerformanceCompact";
import KpiCard from "./KpiCard";
import TabletNavigation from "./TabletNavigation";
import TabletTopbar from "./TabletTopbar";

export default function TabletCommandCenter() {
  const t = useTranslations("Dashboard");
  const tTopbar = useTranslations("Dashboard.Topbar");
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
      {/*
        This tier's frame height is hard-capped at width × 0.625 (TabletFrame's fixed 16:10
        aspect-ratio + overflow-hidden — this tier is NOT free to grow taller like the real
        /demo's own scrollable shell). At this tier's narrow end (~512px frame width) that's only
        ~320px of visible height — enough for the topbar/header/KPI row alone, nothing more. The
        two-card executive row is nested behind `@3xl` (this tier's OWN container, not the outer
        page) specifically because @3xl only matches once the frame is wide enough (≥768px, ≥480px
        of height) to fit it safely; below that threshold it simply doesn't render, rather than
        risk being silently clipped by the frame's overflow-hidden. No operational panel at this
        tier at all — even at this tier's widest (1023px, ~639px tall), there isn't reliably
        enough headroom left after the header/KPI/executive row to add one without risking clipping
        near the top of the next tier's breakpoint; that layer is reserved for the desktop tier
        below, which has real room to work with.
      */}
      <div className="flex h-full w-full flex-col overflow-y-auto bg-demo-background p-4">
        <TabletTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

        <div className="mb-3 shrink-0">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
          <p className="text-sm text-slate-500">
            <DynamicGreeting /> · {tTopbar("attentionCount", { count: 3 })}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-4 gap-2">
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

        <div className="hidden @3xl:mt-3 @3xl:grid @3xl:shrink-0 @3xl:grid-cols-2 @3xl:gap-3">
          <div className="h-40">
            <BusinessPerformanceCompact />
          </div>
          <div className="h-40">
            <AutomationImpact />
          </div>
        </div>
      </div>

      <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
}
