"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Contextual "return to Scenario" action — shown only inside a detail that was opened via a
 * Scenario deep link (`?...&from=scenario`), never for a normal in-module selection (Stage
 * 2J.2C). Rendered once at the very top of each module's shared `XDetailContent`, which the
 * desktop side panel and the mobile/tablet full-screen overlay both already consume unchanged —
 * so this single insertion point covers both breakpoints without a second implementation.
 *
 * Distinct from the existing X close control: X closes the detail and keeps the user in this
 * module; this link leaves the module entirely and returns to the guided trace at /demo/scenario.
 * Reads `from` directly from the current URL on every render (not from browser history), so it
 * behaves identically on first load, client-side navigation, and a hard reload.
 */
export default function ScenarioReturnLink() {
  const searchParams = useSearchParams();
  const t = useTranslations("Dashboard.Scenario");

  if (searchParams.get("from") !== "scenario") return null;

  return (
    <div className="shrink-0 px-3.5 pt-3">
      <Link href="/demo/scenario" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
        <span aria-hidden="true">←</span> {t("backToScenario")}
      </Link>
    </div>
  );
}
