import type { ReactNode } from "react";
import { CloseIcon } from "@/components/dashboard/icons";

/**
 * Shared right-side detail inspector shell (Stage 1 of the ChatGPT-inspired inspector redesign;
 * Customers is the first — and, for now, only — module wired to it via CustomerDetailPanel).
 *
 * Owns chrome only: the outer container (a real flex sibling on desktop — NOT an absolutely
 * positioned overlay — so the workspace it's placed inside genuinely gives up 420px of width
 * instead of just being painted over; full-bleed overlay on mobile), width, surface, left
 * boundary, the header row's layout and close button, the scroll container, the optional
 * Scenario-return slot, and the shared 20px horizontal padding rhythm. It never owns domain data,
 * badges/status semantics, section content, or translations — the calling module supplies all of
 * that via `header`/`children` and decides its own `closeLabel`.
 *
 * Desktop MUST stay a real flex/grid participant, never `position: absolute`: an absolutely
 * positioned panel is taken out of flow, so its sibling (the table) never learns to shrink and
 * keeps rendering at full width underneath it — any column whose boundary lands on the panel's
 * visual edge gets its `whitespace-nowrap` text sliced mid-character (a real bug fixed in
 * Customers' reference implementation; do not reintroduce it when other modules migrate here).
 * The calling module's own row wrapper only needs to be a flex container for this to work — see
 * CustomersDesktop.tsx's `<div className="relative flex min-h-0 flex-1">`.
 *
 * `variant="mobile"` exists architecturally (so a future module can reuse this shell responsively
 * without forcing desktop's positioned-drawer layout onto a full-screen surface) but nothing uses
 * it yet — Customers' mobile/tablet experience still renders CustomerDetailContent directly via
 * CustomerDetailMobile, untouched, outside this shell, per the Stage 1 scope.
 */
export default function DetailInspectorShell({
  variant,
  onClose,
  closeLabel,
  scenarioSlot,
  header,
  children,
}: {
  variant: "desktop" | "mobile";
  onClose: () => void;
  closeLabel: string;
  /** Typically `<ScenarioReturnLink />` — omitted entirely by modules Scenario never deep-links
   * into. Rendered above the header, unmodified, exactly where it already renders today. */
  scenarioSlot?: ReactNode;
  /** Module-owned entity identity (name/id/status line) — the shell only supplies the
   * surrounding row layout and the close button next to it. */
  header: ReactNode;
  /** Module-owned scrollable body — every section, grid, and list stays domain-specific. */
  children: ReactNode;
}) {
  const containerClassName =
    variant === "desktop"
      ? "relative z-20 flex h-full w-[420px] shrink-0 flex-col overflow-hidden border-l border-border bg-surface"
      : "fixed inset-0 z-[60] flex flex-col bg-surface";

  return (
    <div className={containerClassName}>
      {scenarioSlot}
      <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="min-w-0">{header}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
    </div>
  );
}
