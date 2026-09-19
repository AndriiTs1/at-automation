import { useTranslations } from "next-intl";
import { DEMO_USER } from "@/lib/demo-data";
import { BellIcon, SearchIcon } from "./icons";

export default function DashboardTopbar() {
  const t = useTranslations("Dashboard");
  const tTopbar = useTranslations("Dashboard.Topbar");

  return (
    <div className="mb-2 shrink-0 @3xl:mb-1">
      {/* Compact row for narrow containers: sidebar/search are hidden, so surface quick actions here */}
      <div className="flex items-center justify-between gap-2 @lg:hidden">
        <span className="truncate text-sm font-semibold text-slate-900">{t("commandCenter")}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={tTopbar("notifications")}
            className="relative flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
        </div>
      </div>

      <div className="mt-1.5 hidden items-center justify-end gap-3 @lg:mt-0 @lg:flex">
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 @3xl:w-56">
          <SearchIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{tTopbar("searchPlaceholder")}</span>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-xs text-slate-500 @3xl:flex">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          <span className="whitespace-nowrap">{tTopbar("systemsOperational")}</span>
        </div>
        <button
          type="button"
          aria-label={tTopbar("notifications")}
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
        >
          <BellIcon className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            {DEMO_USER.initials}
          </div>
          <div className="hidden min-w-0 max-w-32 text-left @3xl:block">
            <p className="truncate text-xs font-semibold text-slate-900">{DEMO_USER.name}</p>
            <p className="truncate text-[11px] text-slate-400">{t("role")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
