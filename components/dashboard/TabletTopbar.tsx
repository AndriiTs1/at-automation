import { useTranslations } from "next-intl";
import { DEMO_USER } from "@/lib/demo-data";
import { BellIcon, CloseIcon, MenuIcon } from "./icons";

export default function TabletTopbar({ navOpen, onToggleNav }: { navOpen: boolean; onToggleNav: () => void }) {
  const t = useTranslations("Dashboard");
  const tHeader = useTranslations("Header");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="mb-4 shrink-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="tablet-nav-panel"
            aria-label={navOpen ? tHeader("menuClose") : tHeader("menuOpen")}
            onClick={onToggleNav}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/5"
          >
            {navOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <span className="truncate text-base font-semibold text-foreground">{t("commandCenter")}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-neutral-500 @3xl:flex">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            <span className="whitespace-nowrap">{tTopbar("systemsOperational")}</span>
          </span>
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            {DEMO_USER.initials}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-lg font-semibold text-foreground">{tTopbar("greeting", { name: DEMO_USER.firstName })}</p>
        <p className="text-sm text-neutral-500">{tTopbar("attentionCount", { count: 3 })}</p>
      </div>
    </div>
  );
}
