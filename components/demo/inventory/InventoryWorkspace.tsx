"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/dashboard/icons";
import { useQuerySelection } from "@/components/demo/useQuerySelection";
import { Link } from "@/i18n/navigation";
import { INVENTORY_ROWS, INVENTORY_SUMMARY } from "@/lib/demo-data";
import InventoryDesktop from "./InventoryDesktop";
import InventoryDetailMobile from "./InventoryDetailMobile";
import InventoryMobileList from "./InventoryMobileList";
import CustomerFilterDropdown from "@/components/demo/customers/CustomerFilterDropdown";
import {
  buildInventoryFilterOptions,
  type LocationFilterValue,
  type OpenFilter,
  type StatusFilterValue,
} from "./InventoryToolbar";

const SUMMARY_ITEMS = [
  { key: "totalItems", value: INVENTORY_SUMMARY.totalItems, tone: "accent" },
  { key: "lowStock", value: INVENTORY_SUMMARY.lowStock, tone: "error" },
  { key: "reservedUnits", value: INVENTORY_SUMMARY.reservedUnits, tone: "accent" },
  { key: "inventoryValue", value: INVENTORY_SUMMARY.inventoryValue, tone: "success" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/** Compact 2x2 KPI grid shared by the mobile and tablet Inventory sections — same 4 static
 * page-level figures as desktop's summary row, never recomputed from the active filters. */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Inventory");
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2">
      {SUMMARY_ITEMS.map((item) => (
        <div key={item.key} className="rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5">
          <p className="text-xs leading-tight text-neutral-500">{t(`summary.${item.key}`)}</p>
          <p className={`mt-1 text-lg font-bold ${TONE_TEXT[item.tone]}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact "Back to connected workflow" text link — the page-level counterpart to
 * ScenarioReturnLink (which only renders inside an open detail). Deliberately just a single
 * inline link, no banner/card, since Scenario context (`from=scenario`) is now independent of
 * whether any detail panel happens to be open (Stage 2J.3, mirroring Customers/Finance) and must
 * stay reachable either way.
 */
function ScenarioContextLink() {
  const t = useTranslations("Dashboard.Scenario");
  return (
    <Link href="/demo/scenario" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
      <span aria-hidden="true">←</span> {t("backToScenario")}
    </Link>
  );
}

/**
 * Top-level Inventory workspace — owns all filter/selection state and derives filteredItems
 * once, then fans it out to three breakpoint-gated presentations (mobile / tablet / desktop),
 * mirroring CustomersWorkspace's container-query gating (Stage 2D.4). INVENTORY_ROWS stays
 * the single, unfiltered source of truth; no separate filtered dataset, no viewport-specific
 * business logic.
 */
export default function InventoryWorkspace() {
  const t = useTranslations("Dashboard.Inventory");
  const searchParams = useSearchParams();
  // Two independent URL-derived states (Stage 2J.3, mirroring Customers/Finance): `contextItem`
  // marks a row as connected to the Scenario trace (highlight only, never auto-opens anything);
  // `item` is the single source of truth for which detail panel — if any — is open. A Scenario
  // deep-link sets only `contextItem` (+`from`), so arriving from /demo/scenario highlights the
  // row without popping the panel; only an explicit click ever writes `item`. Both are resolved
  // against the full INVENTORY_ROWS dataset, never the filtered list, so neither depends on the
  // current (default, unrelated) filter/search state.
  const contextItemParam = searchParams.get("contextItem");
  const highlightedId =
    contextItemParam && INVENTORY_ROWS.some((row) => row.id === contextItemParam) ? contextItemParam : null;
  const isFromScenario = searchParams.get("from") === "scenario";
  // `dropFromOnClear: false` — closing the detail must not clear `from`/`contextItem`: the
  // highlight and the Back-to-Scenario link are page-level Scenario context, not a side effect of
  // whichever detail happened to be open (see useQuerySelection's docstring).
  const [itemParam, clearItemParam, selectItem] = useQuerySelection("item", { dropFromOnClear: false });
  const selectedId = itemParam && INVENTORY_ROWS.some((row) => row.id === itemParam) ? itemParam : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [locationFilter, setLocationFilter] = useState<LocationFilterValue>("all");
  // Which Status/Location dropdown (if any) is open — owned here rather than inside a toolbar so
  // the Escape handler below can tell a dropdown is open and let its own Escape close it first,
  // instead of closing the Inventory Detail overlay in the same keypress.
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return INVENTORY_ROWS.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (locationFilter !== "all" && item.location !== locationFilter) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, statusFilter, locationFilter]);

  // Reset selection when the active filters change and the previously-selected row is no
  // longer among the results — computed during render, per React's guidance for adjusting
  // state from a changing input rather than via an Effect (mirrors CustomersWorkspace).
  const filterKey = `${searchQuery}|${statusFilter}|${locationFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedId && !filteredItems.some((item) => item.id === selectedId)) clearItemParam();
  }

  // Closing the detail is just clearing the URL param — selectedId (derived above) follows
  // automatically. clearItemParam is already a stable reference (useQuerySelection), so the
  // Escape effect below can safely list it as a dependency without re-attaching every render.
  const closeDetail = clearItemParam;

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A dropdown owns this Escape if one is open — its own handler closes it on this same
      // keypress. Skip closing the detail overlay so the two layers close one at a time:
      // dropdown first, detail on the next Escape.
      if (openFilter) return;
      closeDetail();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, openFilter, closeDetail]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || locationFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  // Resolved from the full dataset (not filteredItems) so a deep-linked item always opens even if
  // it wouldn't currently match the active filter/search — see spec 2J.2 section 8.
  const selectedItem = INVENTORY_ROWS.find((item) => item.id === selectedId) ?? null;
  const { statusOptions, locationOptions } = buildInventoryFilterOptions(t);

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-foreground">{t("title")}</p>
          {isFromScenario && <ScenarioContextLink />}
        </div>
        <SummaryGrid />

        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              aria-label={t("toolbar.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CustomerFilterDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
              ariaLabel={t("toolbar.allStock")}
              open={openFilter === "status"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
            />
            <CustomerFilterDropdown
              value={locationFilter}
              options={locationOptions}
              onChange={setLocationFilter}
              ariaLabel={t("toolbar.allLocations")}
              open={openFilter === "location"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "location" : null)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredItems.length })}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
              >
                {t("toolbar.clearFilters")}
              </button>
            </div>
          )}
        </div>

        <InventoryMobileList
          rows={filteredItems}
          selectedId={selectedId}
          highlightedId={highlightedId}
          onSelect={selectItem}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedItem && <InventoryDetailMobile item={selectedItem} onClose={closeDetail} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
            {isFromScenario && (
              <p className="mt-1">
                <ScenarioContextLink />
              </p>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {t("newItem")}
          </button>
        </div>

        <SummaryGrid />

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex min-w-[160px] flex-1 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              aria-label={t("toolbar.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <CustomerFilterDropdown
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
            ariaLabel={t("toolbar.allStock")}
            open={openFilter === "status"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "status" : null)}
          />
          <CustomerFilterDropdown
            value={locationFilter}
            options={locationOptions}
            onChange={setLocationFilter}
            ariaLabel={t("toolbar.allLocations")}
            open={openFilter === "location"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "location" : null)}
          />

          {hasActiveFilters && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredItems.length })}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
              >
                {t("toolbar.clearFilters")}
              </button>
            </div>
          )}
        </div>

        <InventoryMobileList
          rows={filteredItems}
          selectedId={selectedId}
          highlightedId={highlightedId}
          onSelect={selectItem}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedItem && <InventoryDetailMobile item={selectedItem} onClose={closeDetail} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2D.3 */}
      <InventoryDesktop
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={setOpenFilter}
        filteredItems={filteredItems}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelectRow={selectItem}
        selectedItem={selectedItem}
        onCloseDetail={closeDetail}
        fromScenario={isFromScenario}
      />
    </>
  );
}
