"use client";

import ScenarioDesktop from "./ScenarioDesktop";

/**
 * Top-level Scenario workspace. This is a guided cross-module demo trace, not a new permanent
 * business module: no NAV_SECTIONS entry, no selection/detail state. ScenarioDesktop renders at
 * every breakpoint (single column below @5xl, the accepted two-column trace at @5xl+) — see its
 * own doc comment for why the earlier "desktop-only, renders nothing below @5xl" version was a
 * real bug once Command Center's entry point became reachable from mobile/tablet too.
 */
export default function ScenarioWorkspace() {
  return <ScenarioDesktop />;
}
