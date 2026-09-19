"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { KPI_ITEMS } from "@/lib/demo-data";
import MobileKpiCard from "./MobileKpiCard";
import MobileTopbar from "./MobileTopbar";
import TabletNavigation from "./TabletNavigation";

/** Revenue + Automated Today: one glance at business value and automation value together,
 * without needing all four KPIs to fit this tier's very limited height budget (see below). */
const PREVIEW_KPI_KEYS = ["revenue", "automatedToday"];

export default function MobileCommandCenter() {
  const t = useTranslations("Dashboard");
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
      {/*
        This tier's frame height is hard-capped at width × 0.625 (TabletFrame's fixed 16:10
        aspect-ratio + overflow-hidden — never blindly assume "mobile has plenty of room to
        scroll" the way the real /demo shell does). Topbar + a title-only header need ~74px, and
        the two-KPI row below needs ~109px more (~183px total) — measured empirically. The
        greeting/attention line is dropped here (kept in the tablet/desktop tiers) specifically to
        buy back enough height for the KPI row — a real product number is worth more than a
        personalization line in a ~7-second decorative glance. Gated behind a precise `@min-[310px]`
        (not a named breakpoint) because the safe threshold sits between @xs(320) and standard
        phone widths — this custom value was chosen so the KPI row actually appears at common real
        widths like 360-375px rather than only on unusually wide "mobile" frames. Below that
        threshold, only the title shows — safer than risking a silent clip behind the frame's
        overflow-hidden. No executive card or operational panel at this tier at all; the fuller
        preview lives in the tablet/desktop tiers below.
      */}
      <div className="flex h-full w-full flex-col overflow-y-auto bg-demo-background px-3 pt-1 pb-3">
        <MobileTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

        <div className="mb-1.5 shrink-0">
          <h1 className="text-base leading-tight font-semibold tracking-tight text-slate-900">{t("commandCenter")}</h1>
        </div>

        <div className="hidden @min-[310px]:grid @min-[310px]:shrink-0 @min-[310px]:grid-cols-2 @min-[310px]:gap-2">
          {KPI_ITEMS.filter((item) => PREVIEW_KPI_KEYS.includes(item.key)).map((item) => (
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
      </div>

      <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} panelId="mobile-nav-panel" />
    </div>
  );
}
