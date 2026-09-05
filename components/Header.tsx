"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { routing } from "@/i18n/routing";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type LanguageCode = (typeof routing.locales)[number];

export default function Header() {
  const t = useTranslations("Header");
  const currentLang = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuHeight, setMobileMenuHeight] = useState(0);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Measure the expanded dropdown so the spacer below the fixed Header can push
  // page content down by exactly that amount, instead of the dropdown overlaying it.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const el = mobileDropdownRef.current;
    if (!el) return;

    const measure = () => setMobileMenuHeight(el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [mobileMenuOpen]);

  // Close dropdowns/panels when clicking outside of them.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLanguage = (lang: LanguageCode) => {
    setLangMenuOpen(false);
    router.replace(pathname, { locale: lang });
  };

  const handleLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      event.preventDefault();
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-5 z-50 bg-transparent px-4 md:px-6">
      <div ref={mobilePanelRef} className="relative mx-auto w-full max-w-[1320px] bg-transparent">
        <div className="flex h-[74px] items-center justify-between gap-3 rounded-2xl border border-black/8 bg-white/95 px-4 shadow-md shadow-black/8 backdrop-blur-2xl backdrop-saturate-150">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="my-[13px] mr-4 ml-0 flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt={t("logoAlt")}
              width={48}
              height={48}
              preload
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
            <span className="ml-1.5 inline-block text-xs font-bold tracking-normal text-foreground sm:text-sm md:text-base">
              AUTOMATION
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop language switcher */}
            <div className="relative hidden md:block" ref={langMenuRef}>
              <button
                type="button"
                aria-label={t("languageSwitcherLabel")}
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
                onClick={() => setLangMenuOpen((open) => !open)}
                className="flex items-center gap-1 rounded-full py-1 pr-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-black/5"
              >
                <span className="rounded-lg bg-black/[0.03] px-3 py-1.5">{currentLang.toUpperCase()}</span>
                <ChevronIcon open={langMenuOpen} />
              </button>

              {langMenuOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 mt-2 grid w-44 grid-cols-2 gap-1 rounded-2xl border border-black/5 bg-white/70 p-2 shadow-sm shadow-black/5 backdrop-blur-2xl backdrop-saturate-150"
                >
                  {routing.locales.map((lang) => (
                    <li key={lang}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === currentLang}
                        onClick={() => selectLanguage(lang)}
                        className={`w-full rounded-lg px-4 py-2.5 text-center text-sm transition-colors hover:bg-black/5 ${
                          lang === currentLang ? "bg-black/5 font-semibold text-neutral-900" : "font-medium text-neutral-600"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Desktop CTA */}
            <a
              href="#contact"
              className="hidden items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 md:inline-flex"
            >
              {t("cta")}
            </a>

            {/* Hamburger / close toggle */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-black/5 md:hidden"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileMenuOpen && (
          <div
            ref={mobileDropdownRef}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-black/5 bg-white/90 p-2.5 shadow-sm shadow-black/5 backdrop-blur-xl md:hidden"
          >
            {/* Mobile language switcher */}
            <ul role="listbox" aria-label={t("languageSwitcherLabel")} className="grid grid-cols-6 gap-1 px-0.5 pb-1">
              {routing.locales.map((lang) => (
                <li key={lang}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={lang === currentLang}
                    onClick={() => selectLanguage(lang)}
                    className={`flex w-full items-center justify-center rounded-lg py-2 text-xs transition-colors hover:bg-black/5 ${
                      lang === currentLang ? "bg-black/5 font-semibold text-neutral-900" : "font-medium text-neutral-600"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1.5 flex w-full items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {t("cta")}
            </a>
          </div>
        )}
      </div>
      </header>
      {/* Pushes page content down by the expanded dropdown's height, on mobile only. */}
      <div
        aria-hidden="true"
        className="transition-[height] duration-300 ease-in-out motion-reduce:transition-none md:hidden"
        style={{ height: mobileMenuOpen ? mobileMenuHeight + 8 : 0 }}
      />
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className="h-5 w-5">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className="h-5 w-5">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
