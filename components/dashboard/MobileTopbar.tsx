import { useTranslations } from "next-intl";
import { DEMO_USER } from "@/lib/demo-data";
import { BellIcon, CloseIcon, MenuIcon } from "./icons";

export default function MobileTopbar({ navOpen, onToggleNav }: { navOpen: boolean; onToggleNav: () => void }) {
  const t = useTranslations("Dashboard");
  const tHeader = useTranslations("Header");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="mb-3 shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="mobile-nav-panel"
            aria-label={navOpen ? tHeader("menuClose") : tHeader("menuOpen")}
            onClick={onToggleNav}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/5"
          >
            {navOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <span className="truncate text-sm font-semibold text-foreground">{t("commandCenter")}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-lg leading-tight font-semibold text-foreground">
          {tTopbar("greeting", { name: DEMO_USER.firstName })}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
      </div>
    </div>
  );
}
