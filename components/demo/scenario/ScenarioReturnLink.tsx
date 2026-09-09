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
 *
 * `className` overrides the wrapper's spacing and defaults to the original `px-3.5 pt-3` every
 * existing caller already relies on (Inventory/Finance/Operations/Automations all still render
 * `<ScenarioReturnLink />` with no props, so they're byte-for-byte unaffected). Customers is the
 * only caller opting into `px-5 pt-5`, matching DetailInspectorShell's header padding exactly, so
 * "← Back to connected workflow" sits on the same left axis as the entity name below it instead
 * of ~6px further left.
 */
export default function ScenarioReturnLink({ className = "shrink-0 px-3.5 pt-3" }: { className?: string } = {}) {
  const searchParams = useSearchParams();
  const t = useTranslations("Dashboard.Scenario");

  if (searchParams.get("from") !== "scenario") return null;

  return (
    <div className={className}>
      <Link href="/demo/scenario" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
        <span aria-hidden="true">←</span> {t("backToScenario")}
      </Link>
    </div>
  );
}
