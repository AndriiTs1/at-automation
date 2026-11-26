import { useTranslations } from "next-intl";
import DemoModeBadge from "./DemoModeBadge";
import { DEMO_USER } from "@/lib/demo-data";
import { BellIcon, CloseIcon, MenuIcon } from "./icons";

export default function MobileTopbar({ navOpen, onToggleNav, activeItem = "commandCenter", demoMode = false }: { navOpen: boolean; onToggleNav: () => void; activeItem?: string; demoMode?: boolean }) {
  const t = useTranslations("Dashboard");
  const tHeader = useTranslations("Header");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const tTopbar = useTranslations("Dashboard.Topbar");
  const tScenario = useTranslations("Dashboard.Scenario");

  return (
    <div className="mb-1.5 shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="mobile-nav-panel"
            aria-label={navOpen ? tHeader("menuClose") : tHeader("menuOpen")}
            onClick={onToggleNav}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            {navOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <div className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="max-w-full truncate text-sm font-semibold text-slate-900">{activeItem === "scenario" ? tScenario("title") : activeItem === "commandCenter" ? t("commandCenter") : tSidebar(`items.${activeItem}`)}</span>
            {demoMode && <DemoModeBadge />}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
        </div>
      </div>
    </div>
  );
}
