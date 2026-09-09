"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * Reads one query-string parameter (e.g. `?operation=%2310348`) for record-level deep-link
 * selection, and returns a stable `clear()` that removes that parameter via `router.replace` —
 * so closing a deep-linked detail doesn't leave a stale `?operation=...` behind and doesn't add
 * browser-history noise. Shared by every module Scenario can deep-link into (Customers/
 * Operations/Inventory/Finance/Automations) instead of five near-identical copies of the same
 * URLSearchParams bookkeeping (Stage 2J.2; `from` cleanup added 2J.2C for the Scenario
 * return-navigation loop).
 *
 * By default `clear()` also drops the `from=scenario` origin marker together with the param,
 * since in Operations/Inventory/Finance/Automations that marker only ever accompanies this same
 * param (the deep-link opens the detail directly, so there's nothing else `from` could mean).
 * Customers no longer fits that assumption — it separates *highlighted* (`contextCustomer`) from
 * *open detail* (`customer`), and `from` belongs to the highlight, not to whichever detail happens
 * to be open — so it opts out via `{ dropFromOnClear: false }` and closing its detail leaves
 * `from`/`contextCustomer` untouched. This is an additive, opt-in option: every other call site
 * omits it and keeps today's exact behavior.
 *
 * Also returns a stable `select(id)` that writes this param via `router.push`, so a module can
 * make the URL the single source of truth for its selection instead of keeping a parallel local
 * `useState` that can drift out of sync with the address bar (e.g. a manual click leaving no URL
 * trace, so a same-URL sidebar link can't ever clear it). `push` (not `replace`) is deliberate:
 * opening a record is a real navigation the user should be able to back out of one step at a
 * time, landing back on the bare list — unlike `clear()`, which stays a `replace` so closing/
 * cleanup never piles up extra history entries. `select()` preserves every other existing query
 * param (only Customers currently calls it, precisely so a manual open can coexist with an
 * already-present `contextCustomer`/`from` instead of wiping them).
 *
 * `useSearchParams` (plain Next.js) is used for reading since query params carry no locale
 * concern; `usePathname`/`useRouter` from `@/i18n/navigation` are used for writing so the
 * replace/push never hard-codes or drops the current locale prefix.
 */
export function useQuerySelection(paramName: string, options?: { dropFromOnClear?: boolean }) {
  const dropFromOnClear = options?.dropFromOnClear ?? true;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const value = searchParams.get(paramName);

  const select = useCallback(
    (id: string) => {
      const remaining: Record<string, string> = {};
      searchParams.forEach((paramValue, key) => {
        if (key !== paramName) remaining[key] = paramValue;
      });
      remaining[paramName] = id;
      router.push({ pathname, query: remaining }, { scroll: false });
    },
    [paramName, pathname, router, searchParams],
  );

  const clear = useCallback(() => {
    const alsoHasFrom = dropFromOnClear && searchParams.has("from");
    if (!searchParams.has(paramName) && !alsoHasFrom) return;
    const remaining: Record<string, string> = {};
    searchParams.forEach((paramValue, key) => {
      if (key === paramName) return;
      if (dropFromOnClear && key === "from") return;
      remaining[key] = paramValue;
    });
    router.replace({ pathname, query: remaining }, { scroll: false });
  }, [paramName, pathname, router, searchParams, dropFromOnClear]);

  return [value, clear, select] as const;
}
