const NAV_ICON_PATHS: Record<string, string> = {
  sync: "M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0112-2L20 12M4 12l2.5 6a7 7 0 0012-2",
  workflow: "M3 3h7v6H3zM14 15h7v6h-7zM6.5 9v9H14M10 6h7.5v9",
  rules: "M9 5h11M9 12h11M9 19h11M3 5l1.5 1.5L7 3M3 12l1.5 1.5L7 10M3 19l1.5 1.5L7 17",
  info: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 11v6M12 7h.01",
  server: "M4 3h16v7H4zM4 14h16v7H4zM7 6.5h1M7 17.5h1M12 6.5h5M12 17.5h5",
  calculator: "M5 3h14v18H5zM8 6h8v4H8zM8 14h1m6 0h1m-8 4h1m6 0h1",
  warehouse: "M3 21V8l9-5 9 5v13M7 21V11h10v10M7 15h10M7 18h10",
  card: "M3 5h18v14H3zM3 10h18M6 15h4",
  cart: "M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  tools: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 13v8M13 17h8",
  network: "M9 3h6v6H9zM3 15h6v6H3zM15 15h6v6h-6zM12 9v3M6 15v-3h12v3",
  exchange: "M3 8h18m-5-5 5 5-5 5M21 16H3m5-5-5 5 5 5",
  grid: "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  list: "M4 6h16M4 12h16M4 18h10",
  users: "M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5m2-5c2.5 0 5 2 5 5",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v9m0 0l8-4.5M12 12L4 7.5",
  chart: "M5 20V10m7 10V4m7 16v-7",
  bolt: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
  activity: "M3 12h4l2-7 4 14 2-7h6",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM8.5 8h7M8.5 12h7M8.5 16h4",
  message: "M4 4h16v12H9l-5 4V4zM8 8h8M8 12h5",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
  check: "M5 13l4 4L19 7",
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={NAV_ICON_PATHS[name]} />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 9a6 6 0 1 1 12 0c0 3.2 1 5 1.5 6H4.5C5 14 6 12.2 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <circle cx="9" cy="9" r="6" />
      <path d="M14.5 6.5A6 6 0 1 1 9 15" strokeLinecap="round" />
    </svg>
  );
}

export function PlugIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 3v4M16 3v4M6 7h12v3a6 6 0 0 1-12 0V7z" />
      <path d="M12 16v5" />
    </svg>
  );
}

/** Single entry point for icon-by-name lookups (sidebar nav, KPI icons, etc.) — dispatches to the
 * multi-primitive icons where a flat path isn't expressive enough, otherwise renders from NAV_ICON_PATHS. */
export function DashboardIcon({ name, className }: { name: string; className?: string }) {
  if (name === "coins") return <CoinsIcon className={className} />;
  if (name === "plug") return <PlugIcon className={className} />;
  return <NavIcon name={name} className={className} />;
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className={className}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
