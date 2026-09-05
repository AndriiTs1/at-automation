import { useTranslations } from "next-intl";
import { DEMO_USER, NAV_SECTIONS } from "@/lib/demo-data";
import { Link } from "@/i18n/navigation";
import { ArrowLeftIcon, DashboardIcon, NavIcon } from "./icons";

export default function DashboardSidebar({ activeItem = "commandCenter" }: { activeItem?: string } = {}) {
  const t = useTranslations("Dashboard");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const tHeader = useTranslations("Header");

  return (
    <div className="hidden w-14 shrink-0 flex-col bg-neutral-900 py-4 @lg:flex @3xl:w-56 @3xl:p-5 @3xl:py-5">
      <Link
        href="/"
        aria-label={tHeader("logoAlt")}
        className="mb-5 flex items-center justify-center gap-2 px-2 @3xl:justify-start @3xl:px-0"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
          AT
        </div>
        <span className="hidden text-xs font-semibold tracking-wide text-white/90 @3xl:inline">AUTOMATION</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        <button
          type="button"
          aria-current={activeItem === "commandCenter" ? "page" : undefined}
          className={`flex items-center justify-center gap-2.5 rounded-lg p-2 text-xs font-medium transition-colors @3xl:justify-start @3xl:px-3 @3xl:py-2 ${
            activeItem === "commandCenter" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
          }`}
        >
          <NavIcon name="grid" className="h-4 w-4 shrink-0" />
          <span className="hidden truncate @3xl:inline">{t("commandCenter")}</span>
        </button>

        {NAV_SECTIONS.map((section) => (
          <div key={section.key}>
            <p className="mb-1 hidden truncate px-3 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase @3xl:block">
              {tSidebar(`sections.${section.key}`)}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = activeItem === item.key;
                const itemClassName = `flex items-center justify-center gap-2.5 rounded-lg p-2 text-xs font-medium transition-colors @3xl:justify-between @3xl:px-3 @3xl:py-2 ${
                  isActive ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                }`;
                const itemContent = (
                  <>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
                      <span className="hidden truncate @3xl:inline">{tSidebar(`items.${item.key}`)}</span>
                    </span>
                    {"badge" in item && item.badge && (
                      <span className="hidden shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 @3xl:inline">
                        {item.badge}
                      </span>
                    )}
                  </>
                );

                return "available" in item && item.available ? (
                  <Link key={item.key} href={item.href} aria-current={isActive ? "page" : undefined} className={itemClassName}>
                    {itemContent}
                  </Link>
                ) : (
                  <button key={item.key} type="button" className={itemClassName}>
                    {itemContent}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 rounded-lg p-2 text-xs font-medium text-accent transition-colors hover:bg-accent/10 hover:brightness-110 focus-visible:bg-accent/10 focus-visible:brightness-110 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none @3xl:justify-start @3xl:px-3 @3xl:py-2"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          <span className="hidden truncate @3xl:inline">{t("backToWebsite")}</span>
        </Link>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 rounded-lg p-2 text-xs font-medium text-accent transition-colors hover:bg-white/5 @3xl:justify-start @3xl:px-3 @3xl:py-2"
        >
          <DashboardIcon name="sparkle" className="h-4 w-4 shrink-0" />
          <span className="hidden truncate @3xl:inline">{t("askAt")}</span>
        </button>

        <div className="flex items-center justify-center gap-2 px-2 @3xl:justify-start @3xl:px-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
          <div className="hidden min-w-0 text-left @3xl:block">
            <p className="truncate text-xs font-semibold text-white/90">{DEMO_USER.name}</p>
            <p className="truncate text-[11px] text-neutral-500">{t("operationsManager")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
