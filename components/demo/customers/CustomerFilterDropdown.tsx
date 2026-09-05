"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDownIcon, NavIcon } from "@/components/dashboard/icons";

export type FilterDropdownOption<T extends string> = {
  value: T;
  label: string;
};

/**
 * Lightweight custom dropdown replacing native <select> for the Customers Segment/Health
 * filters (Stage 2C.3 polish) — native selects render as detached OS popups on macOS/Chrome
 * that don't match AT's visual language. Anchored via a relative wrapper + absolutely
 * positioned menu (w-full of the wrapper) so the menu always matches the trigger's width
 * and sits directly beneath it, instead of OS-controlled positioning/sizing.
 *
 * Focus stays on the trigger button the whole time (click doesn't move focus into the list),
 * so all keyboard handling — including Escape and Arrow navigation — lives on the trigger and
 * tracks a visually-highlighted "active" option via aria-activedescendant, the standard
 * pattern for this kind of listbox-button combo.
 */
export default function CustomerFilterDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  open,
  onOpenChange,
}: {
  value: T;
  options: FilterDropdownOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex] ?? options[0];

  // Reset keyboard-active option to the current selection whenever the menu transitions to
  // open — adjusted during render (React's guidance for deriving state from a changing prop)
  // rather than via an Effect, so no setState-in-effect cascade.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setActiveIndex(selectedIndex);
  }

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpenChange(true);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(options[activeIndex].value);
      onOpenChange(false);
    } else if (event.key === "Tab") {
      onOpenChange(false);
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        onKeyDown={handleTriggerKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        className="grid items-center rounded-full border border-border bg-surface py-2 pr-3 pl-3 text-sm text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        {/* Invisible stacked copies of every option (CSS grid layering, no JS measurement) size
            the button to the widest label in this dropdown's own list — so a long localized
            label (e.g. German "Schlüsselkunde") never gets truncated and the trigger never
            visibly resizes as the selection changes, without making the control oversized for
            what its own option set actually needs. */}
        {options.map((option) => (
          <span
            key={option.value}
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{option.label}</span>
            <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" />
          </span>
        ))}
        <span className="col-start-1 row-start-1 flex w-full items-center justify-between gap-1.5">
          <span className="truncate">{selected.label}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg shadow-black/10"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    onOpenChange(false);
                  }}
                  className={`flex w-full items-center justify-between gap-1.5 px-3 py-1.5 text-left text-sm transition-colors focus:outline-none ${
                    index === activeIndex ? "bg-black/[0.03]" : ""
                  } ${isSelected ? "font-medium text-foreground" : "text-neutral-600"}`}
                >
                  <span className="truncate">{option.label}</span>
                  {/* Icon slot always reserved (matching the trigger's chevron slot exactly) so the
                      selected row never needs more width than the trigger already provides. */}
                  <NavIcon name="check" className={`h-3.5 w-3.5 shrink-0 text-accent ${isSelected ? "" : "invisible"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
