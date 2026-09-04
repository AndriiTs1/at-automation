import { useTranslations } from "next-intl";
import { DEMO_USER } from "@/lib/demo-data";
import { BellIcon, SearchIcon } from "./icons";

export default function DashboardTopbar() {
  const t = useTranslations("Dashboard");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="mb-3 shrink-0 @3xl:mb-2">
      {/* Compact row for narrow containers: sidebar/search are hidden, so surface quick actions here */}
      <div className="flex items-center justify-between gap-2 @lg:hidden">
        <span className="truncate text-sm font-semibold text-foreground">{t("commandCenter")}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-start justify-between gap-3 @lg:mt-0">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground @lg:text-sm @lg:font-normal @lg:text-neutral-500">
            {tTopbar("greeting", { name: DEMO_USER.firstName })}
          </p>
          <p className="text-xs text-neutral-500 @lg:text-sm">{tTopbar("attentionCount", { count: 3 })}</p>
        </div>

        <div className="hidden items-center gap-3 @lg:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-neutral-400 @3xl:w-56">
            <SearchIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tTopbar("searchPlaceholder")}</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-neutral-500 @3xl:flex">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            <span className="whitespace-nowrap">{tTopbar("systemsOperational")}</span>
          </div>
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {DEMO_USER.initials}
            </div>
            <div className="hidden min-w-0 max-w-32 text-left @3xl:block">
              <p className="truncate text-xs font-semibold text-foreground">{DEMO_USER.name}</p>
              <p className="truncate text-[11px] text-neutral-500">{t("operationsManager")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
