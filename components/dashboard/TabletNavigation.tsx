"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { DEMO_USER, NAV_SECTIONS } from "@/lib/demo-data";
import { Link } from "@/i18n/navigation";
import { ArrowLeftIcon, DashboardIcon, NavIcon } from "./icons";

export default function TabletNavigation({
  open,
  onClose,
  panelId = "tablet-nav-panel",
  activeItem = "commandCenter",
}: {
  open: boolean;
  onClose: () => void;
  panelId?: string;
  activeItem?: string;
}) {
  const t = useTranslations("Dashboard");
  const tSidebar = useTranslations("Dashboard.Sidebar");
  const tHeader = useTranslations("Header");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding panel */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label={t("commandCenter")}
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
        className={`absolute inset-y-0 left-0 z-50 flex w-64 max-w-[80%] flex-col bg-neutral-900 p-3 shadow-xl transition-transform duration-200 focus:outline-none @lg:p-4 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/"
          onClick={onClose}
          aria-label={tHeader("logoAlt")}
          className="mb-2 flex shrink-0 items-center gap-2 @lg:mb-4"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
            AT
          </div>
          <span className="text-xs font-semibold tracking-wide text-white/90">AUTOMATION</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto @lg:gap-2">
          <button
            type="button"
            aria-current={activeItem === "commandCenter" ? "page" : undefined}
            onClick={onClose}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeItem === "commandCenter" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            }`}
          >
            <NavIcon name="grid" className="h-4 w-4 shrink-0" />
            {t("commandCenter")}
          </button>

          {NAV_SECTIONS.map((section) => (
            <div key={section.key}>
              <p className="mb-1 px-3 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
                {tSidebar(`sections.${section.key}`)}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = activeItem === item.key;
                  const itemClassName = `flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`;
                  const itemContent = (
                    <>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
                        <span className="truncate">{tSidebar(`items.${item.key}`)}</span>
                      </span>
                      {"badge" in item && item.badge && (
                        <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300">
                          {item.badge}
                        </span>
                      )}
                    </>
                  );

                  return "available" in item && item.available ? (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={itemClassName}
                    >
                      {itemContent}
                    </Link>
                  ) : (
                    <button key={item.key} type="button" onClick={onClose} className={itemClassName}>
                      {itemContent}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-2 flex shrink-0 flex-col gap-1.5 border-t border-white/10 pt-2 @lg:mt-3 @lg:gap-2 @lg:pt-3">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/10 hover:brightness-110 focus-visible:bg-accent/10 focus-visible:brightness-110 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            <ArrowLeftIcon className="h-4 w-4 shrink-0" />
            {t("backToWebsite")}
          </Link>

          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-white/5"
          >
            <DashboardIcon name="sparkle" className="h-4 w-4 shrink-0" />
            {t("askAt")}
          </button>
          <div className="flex items-center gap-2 px-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
              {DEMO_USER.initials}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-semibold text-white/90">{DEMO_USER.name}</p>
              <p className="truncate text-[11px] text-neutral-500">{t("role")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
