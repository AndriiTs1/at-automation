import { useTranslations } from "next-intl";
import Image from "next/image";
import { DEMO_USER, NAV_SECTIONS } from "@/lib/demo-data";
import { Link } from "@/i18n/navigation";
import { ArrowLeftIcon, DashboardIcon, NavIcon } from "./icons";

export default function DashboardSidebar({ activeItem = "commandCenter" }: { activeItem?: string } = {}) {
  const t = useTranslations("Dashboard");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const tHeader = useTranslations("Header");

  return (
    <div className="hidden w-14 shrink-0 flex-col border-r border-slate-200/70 bg-white py-4 @lg:flex @3xl:w-56 @3xl:p-5 @3xl:py-5">
      <Link
        href="/"
        aria-label={tHeader("logoAlt")}
        className="mb-5 flex items-center justify-center gap-2 px-2 @3xl:justify-start @3xl:px-0"
      >
        <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
        <span className="hidden text-xs font-semibold tracking-wide text-slate-900 @3xl:inline">AUTOMATION</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto @3xl:gap-5">
        <Link
          href="/demo"
          aria-current={activeItem === "commandCenter" ? "page" : undefined}
          className={`flex items-center justify-center gap-2.5 rounded-xl p-2 text-xs font-medium transition-colors @3xl:justify-start @3xl:px-3 @3xl:py-2 ${
            activeItem === "commandCenter"
              ? "bg-blue-50 text-blue-600 @3xl:font-semibold @3xl:ring-1 @3xl:ring-inset @3xl:ring-blue-600/10"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <NavIcon name="grid" className={`h-4 w-4 shrink-0 ${activeItem === "commandCenter" ? "text-blue-600" : "text-slate-400"}`} />
          <span className="hidden truncate @3xl:inline">{t("commandCenter")}</span>
        </Link>

        {NAV_SECTIONS.map((section) => (
          <div key={section.key}>
            <p className="mb-1.5 hidden truncate px-3 text-[10.5px] font-medium tracking-[0.08em] text-slate-400 uppercase @3xl:block">
              {tSidebar(`sections.${section.key}`)}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = activeItem === item.key;
                const itemClassName = `flex items-center justify-center gap-2.5 rounded-xl p-2 text-xs font-medium transition-colors @3xl:justify-between @3xl:px-3 @3xl:py-2 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 @3xl:font-semibold @3xl:ring-1 @3xl:ring-inset @3xl:ring-blue-600/10"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`;
                const itemContent = (
                  <>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <NavIcon name={item.icon} className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="hidden truncate @3xl:inline">{tSidebar(`items.${item.key}`)}</span>
                    </span>
                    {"badge" in item && item.badge && (
                      <span className="hidden shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 @3xl:inline">
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

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200/70 pt-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 rounded-xl p-2 text-xs font-medium text-accent transition-colors hover:bg-accent/10 hover:brightness-110 focus-visible:bg-accent/10 focus-visible:brightness-110 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none @3xl:justify-start @3xl:px-3 @3xl:py-2"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          <span className="hidden truncate @3xl:inline">{t("backToWebsite")}</span>
        </Link>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 rounded-xl p-2 text-xs font-medium text-accent transition-colors hover:bg-slate-100 @3xl:justify-start @3xl:px-3 @3xl:py-2"
        >
          <DashboardIcon name="sparkle" className="h-4 w-4 shrink-0" />
          <span className="hidden truncate @3xl:inline">{t("askAt")}</span>
        </button>

        <div className="flex items-center justify-center gap-2 px-2 @3xl:justify-start @3xl:gap-2.5 @3xl:rounded-2xl @3xl:border @3xl:border-slate-200/70 @3xl:bg-slate-50 @3xl:px-2.5 @3xl:py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {DEMO_USER.initials}
          </div>
          <div className="hidden min-w-0 text-left @3xl:block">
            <p className="truncate text-xs font-semibold text-slate-900">{DEMO_USER.name}</p>
            <p className="truncate text-[11px] text-slate-400">{t("role")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
