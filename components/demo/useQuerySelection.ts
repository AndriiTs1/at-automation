"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * Reads one query-string parameter (e.g. `?operation=%2310348`) for record-level deep-link
 * selection, and returns a stable `clear()` that removes that parameter (and, since it only ever
 * accompanies a Scenario-originated entity param, the `from=scenario` origin marker too) via
 * `router.replace` — so closing a deep-linked detail doesn't leave a stale `?customer=...` or
 * `?from=scenario` behind and doesn't add browser-history noise. Shared by every module Scenario
 * can deep-link into (Customers/Operations/Inventory/Finance/Automations) instead of five
 * near-identical copies of the same URLSearchParams bookkeeping (Stage 2J.2; `from` cleanup added
 * 2J.2C for the Scenario return-navigation loop).
 *
 * `useSearchParams` (plain Next.js) is used for reading since query params carry no locale
 * concern; `usePathname`/`useRouter` from `@/i18n/navigation` are used for clearing so the
 * replace never hard-codes or drops the current locale prefix.
 */
export function useQuerySelection(paramName: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const value = searchParams.get(paramName);

  const clear = useCallback(() => {
    if (!searchParams.has(paramName) && !searchParams.has("from")) return;
    const remaining: Record<string, string> = {};
    searchParams.forEach((paramValue, key) => {
      if (key !== paramName && key !== "from") remaining[key] = paramValue;
    });
    router.replace({ pathname, query: remaining }, { scroll: false });
  }, [paramName, pathname, router, searchParams]);

  return [value, clear] as const;
}
