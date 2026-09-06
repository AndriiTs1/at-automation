"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { DEMO_USER } from "@/lib/demo-data";

export type GreetingBucket = "morning" | "afternoon" | "evening" | "welcomeBack";

/**
 * Pure, testable mapping from a 0–23 local hour to a greeting bucket:
 *   05:00–11:59 → morning
 *   12:00–17:59 → afternoon
 *   18:00–22:59 → evening
 *   23:00–04:59 → welcomeBack (neutral late-hours greeting)
 */
export function getGreetingBucket(hour: number): GreetingBucket {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "evening";
  return "welcomeBack";
}

/** No real external event to subscribe to — the bucket only ever changes once, right after
 * mount, when React re-checks the snapshot. */
function subscribe() {
  return () => {};
}

function getSnapshot(): GreetingBucket {
  return getGreetingBucket(new Date().getHours());
}

/** Local browser time isn't known during SSR — use the same neutral fallback the client uses
 * on its first paint, so hydration never mismatches. */
function getServerSnapshot(): GreetingBucket {
  return "welcomeBack";
}

/**
 * Command-Center-only personalized greeting (owner experience fix). useSyncExternalStore is the
 * idiomatic way to read a client-only value safely: React renders getServerSnapshot() on the
 * server AND on the client's first paint (so they always match, no hydration mismatch and no
 * suppressHydrationWarning needed), then re-renders with the real getSnapshot() value right
 * after mount once local time is actually known.
 */
export default function DynamicGreeting() {
  const t = useTranslations("Dashboard.Topbar");
  const bucket = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return <>{t(`greeting.${bucket}`, { name: DEMO_USER.firstName })}</>;
}
