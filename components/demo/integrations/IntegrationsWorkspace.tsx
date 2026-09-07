"use client";

import { useEffect, useState } from "react";
import { INTEGRATION_DEFINITIONS } from "@/lib/demo-data";
import IntegrationsDesktop from "./IntegrationsDesktop";

/**
 * Top-level Integrations workspace (Stage 2G.2) — owns selectedIntegrationId and resolves the
 * selected IntegrationDefinition, mirroring AutomationsWorkspace/InventoryWorkspace's ownership
 * pattern. Desktop-only for this stage (2G.1/2G.2 have no mobile/tablet presentation yet — that
 * is Stage 2G.3), so this is simpler than AutomationsWorkspace: a single breakpoint branch, no
 * fan-out. No filters exist either, so the Escape handler stays simple: there's no open dropdown
 * that could compete for the same keypress. INTEGRATION_DEFINITIONS stays the single, unfiltered
 * source of truth — no separate filtered dataset.
 */
export default function IntegrationsWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const selectedIntegration = INTEGRATION_DEFINITIONS.find((integration) => integration.id === selectedId) ?? null;

  return (
    <IntegrationsDesktop
      selectedId={selectedId}
      onSelectRow={setSelectedId}
      selectedIntegration={selectedIntegration}
      onCloseDetail={() => setSelectedId(null)}
    />
  );
}
