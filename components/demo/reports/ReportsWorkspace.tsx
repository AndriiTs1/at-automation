"use client";

import ReportsDesktop from "./ReportsDesktop";

/**
 * Top-level Reports workspace (Stage 2H.1 — desktop foundation). No selection/detail state yet:
 * this stage has no drill-down, so unlike Automations/Integrations' Workspace this owns nothing.
 * It exists only so a later responsive stage can add mobile/tablet branches here without
 * restructuring the route's entry component — mirroring every other module's
 * {Module}Workspace + {Module}Desktop split from day one.
 */
export default function ReportsWorkspace() {
  return <ReportsDesktop />;
}
