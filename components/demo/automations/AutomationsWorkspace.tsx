"use client";

import { useEffect, useState } from "react";
import { AUTOMATION_DEFINITIONS } from "@/lib/demo-data";
import AutomationsDesktop from "./AutomationsDesktop";

/**
 * Top-level Automations workspace (Stage 2F.2) — owns selectedAutomationId and resolves the
 * selected AutomationDefinition, mirroring InventoryWorkspace/CustomersWorkspace's ownership
 * pattern. No filters exist yet (Stage 2F.1/2F.2 are read-only, search/filters are a later
 * stage), so this Escape handler is simpler than Inventory's: there's no open dropdown that could
 * compete for the same keypress. AUTOMATION_DEFINITIONS stays the single, unfiltered source of
 * truth — no separate filtered dataset.
 */
export default function AutomationsWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedAutomation = AUTOMATION_DEFINITIONS.find((automation) => automation.id === selectedId) ?? null;

  return (
    <AutomationsDesktop
      selectedId={selectedId}
      onSelectRow={setSelectedId}
      selectedAutomation={selectedAutomation}
      onCloseDetail={() => setSelectedId(null)}
    />
  );
}
