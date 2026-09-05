"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import MobileTopbar from "../dashboard/MobileTopbar";
import TabletNavigation from "../dashboard/TabletNavigation";
import TabletTopbar from "../dashboard/TabletTopbar";

/** Maps the current (locale-stripped) demo pathname to the sidebar/drawer item key it represents. */
function useActiveDemoItem() {
  const pathname = usePathname();
  if (pathname === "/demo/operations") return "operations";
  return "commandCenter";
}

/**
 * Persistent chrome for the real /demo application: sidebar (desktop), topbar (all
 * breakpoints), and drawer navigation (tablet/mobile). Reuses the same low-level pieces
 * as the landing's embedded showcase, but — unlike the landing — owns the full browser
 * viewport instead of a small TabletFrame mock, and renders a swappable {children}
 * workspace instead of hardcoded Command Center content.
 */
export default function DemoAppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const activeItem = useActiveDemoItem();

  useEffect(() => {
    if (!navOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navOpen]);

  return (
    <div className="@container flex h-full w-full">
      {/* Mobile shell (below @lg) */}
      <div className="relative flex min-w-0 flex-1 @lg:hidden">
        <div className="flex h-full w-full flex-col overflow-y-auto bg-neutral-50 px-3 pt-1 pb-3">
          <MobileTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />
          {children}
        </div>
        <TabletNavigation
          open={navOpen}
          onClose={() => setNavOpen(false)}
          panelId="mobile-nav-panel"
          activeItem={activeItem}
        />
      </div>

      {/* Tablet shell (@lg to below @5xl) */}
      <div className="relative hidden min-w-0 flex-1 @lg:flex @5xl:hidden">
        <div className="flex h-full w-full flex-col overflow-y-auto bg-neutral-50 p-4">
          <TabletTopbar navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />
          {children}
        </div>
        <TabletNavigation open={navOpen} onClose={() => setNavOpen(false)} activeItem={activeItem} />
      </div>

      {/* Desktop shell (@5xl and up) */}
      <div className="hidden w-full @5xl:flex">
        <DashboardSidebar activeItem={activeItem} />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-neutral-50 p-3 @lg:p-4 @3xl:p-2.5">
          <DashboardTopbar />
          {children}
        </div>
      </div>
    </div>
  );
}
