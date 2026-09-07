"use client";

import { useTranslations } from "next-intl";
import { AUTOMATION_DEFINITIONS, type AutomationDefinition } from "@/lib/demo-data";
import { formatAutomationTimestamp } from "./automationFormatters";

const STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-neutral-200 text-neutral-600",
  needsAttention: "bg-warning/10 text-warning",
};

/**
 * Dense stacked automation list for tablet and mobile (Stage 2F.4) — mirrors InventoryMobileList/
 * CustomersMobileList's pattern: one reusable presentation shared by both breakpoints, since the
 * priority fields and interaction model are identical; only the surrounding header/summary markup
 * differs per breakpoint (see AutomationsWorkspace). The desktop table (AutomationsDesktop) is
 * untouched and not reused here. AUTOMATION_DEFINITIONS is read directly — there is no filtering
 * in this stage, so no separate filtered dataset exists.
 */
export default function AutomationsMobileList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("Dashboard.Automations");

  return (
    <ul className="flex flex-col gap-2">
      {AUTOMATION_DEFINITIONS.map((automation: AutomationDefinition) => {
        const isSelected = automation.id === selectedId;
        return (
          <li key={automation.id}>
            <button
              type="button"
              onClick={() => onSelect(automation.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                isSelected ? "border-accent/40 bg-accent/5" : "border-border bg-surface hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 text-sm font-semibold break-words text-foreground">
                  {t(`definitions.${automation.key}.name`)}
                </p>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium break-words ${STATUS_TONE[automation.status]}`}
                >
                  {t(`status.${automation.status}`)}
                </span>
              </div>

              <p className="text-xs text-neutral-500">{t(`category.${automation.category}`)}</p>

              <p className="text-xs break-words text-neutral-600">
                {t(`definitions.${automation.key}.trigger`)}
              </p>

              <p className="text-xs text-neutral-400">
                {t("mobileList.runsToday", { count: automation.runsToday })} ·{" "}
                {formatAutomationTimestamp(automation.lastRun, t)}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
