"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/dashboard/icons";
import { CUSTOMERS_ROWS, CUSTOMERS_SUMMARY } from "@/lib/demo-data";
import CustomerDetailMobile from "./CustomerDetailMobile";
import CustomerFilterDropdown from "./CustomerFilterDropdown";
import CustomersDesktop from "./CustomersDesktop";
import CustomersMobileList from "./CustomersMobileList";
import { buildCustomerFilterOptions, type HealthFilterValue, type OpenFilter, type SegmentFilterValue } from "./CustomersToolbar";

const SUMMARY_ITEMS = [
  { key: "totalCustomers", value: CUSTOMERS_SUMMARY.totalCustomers, tone: "accent" },
  { key: "activeAccounts", value: CUSTOMERS_SUMMARY.activeAccounts, tone: "success" },
  { key: "needsAttention", value: CUSTOMERS_SUMMARY.needsAttention, tone: "error" },
  { key: "outstanding", value: CUSTOMERS_SUMMARY.outstanding, tone: "accent" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/** Compact 2x2 KPI grid shared by the mobile and tablet Customers sections — same 4 static
 * page-level figures as desktop's summary row, never recomputed from the active filters. */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Customers");
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
 * Top-level Customers workspace — owns all filter/selection state and derives
 * filteredCustomers once, then fans it out to three breakpoint-gated presentations
 * (mobile / tablet / desktop), mirroring OperationsWorkspace's container-query gating
 * (Stage 2C.4). CUSTOMERS_ROWS stays the single, unfiltered source of truth.
 */
export default function CustomersWorkspace() {
  const t = useTranslations("Dashboard.Customers");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilterValue>("all");
  const [healthFilter, setHealthFilter] = useState<HealthFilterValue>("all");
  // Which Segment/Health dropdown (if any) is open — owned here rather than inside a toolbar so
  // the Escape handler below can tell a dropdown is open and let its own Escape close it first,
  // instead of closing the Customer Detail overlay in the same keypress.
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return CUSTOMERS_ROWS.filter((row) => {
      if (segmentFilter !== "all" && row.segment !== segmentFilter) return false;
      if (healthFilter !== "all" && row.health !== healthFilter) return false;
      if (!query) return true;
      return (
        row.name.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query) ||
        row.owner.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, segmentFilter, healthFilter]);

  // Reset selection when the active filters change and the previously-selected row is no
  // longer among the results — computed during render, per React's guidance for adjusting
  // state from a changing input rather than via an Effect (mirrors OperationsWorkspace).
  const filterKey = `${searchQuery}|${segmentFilter}|${healthFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedId && !filteredCustomers.some((row) => row.id === selectedId)) {
      setSelectedId(null);
    }
  }

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A dropdown owns this Escape if one is open — its own handler closes it on this same
      // keypress. Skip closing the detail overlay so the two layers close one at a time:
      // dropdown first, detail on the next Escape.
      if (openFilter) return;
      setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, openFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || segmentFilter !== "all" || healthFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSegmentFilter("all");
    setHealthFilter("all");
  };

  const selectedCustomer = filteredCustomers.find((row) => row.id === selectedId) ?? null;
  const { segmentOptions, healthOptions } = buildCustomerFilterOptions(t);

  return (
    <>
      {/* Mobile workspace (below @lg) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 @lg:hidden">
        <p className="text-base font-semibold text-foreground">{t("title")}</p>
        <SummaryGrid />

        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("toolbar.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CustomerFilterDropdown
              value={segmentFilter}
              options={segmentOptions}
              onChange={setSegmentFilter}
              ariaLabel={t("toolbar.allSegments")}
              open={openFilter === "segment"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "segment" : null)}
            />
            <CustomerFilterDropdown
              value={healthFilter}
              options={healthOptions}
              onChange={setHealthFilter}
              ariaLabel={t("toolbar.allHealth")}
              open={openFilter === "health"}
              onOpenChange={(isOpen) => setOpenFilter(isOpen ? "health" : null)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredCustomers.length })}
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

        <CustomersMobileList
          rows={filteredCustomers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedCustomer && <CustomerDetailMobile customer={selectedCustomer} onClose={() => setSelectedId(null)} />}
      </div>

      {/* Tablet workspace (@lg to below @5xl) */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 @lg:flex @5xl:hidden">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{t("description")}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {t("newCustomer")}
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
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <CustomerFilterDropdown
            value={segmentFilter}
            options={segmentOptions}
            onChange={setSegmentFilter}
            ariaLabel={t("toolbar.allSegments")}
            open={openFilter === "segment"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "segment" : null)}
          />
          <CustomerFilterDropdown
            value={healthFilter}
            options={healthOptions}
            onChange={setHealthFilter}
            ariaLabel={t("toolbar.allHealth")}
            open={openFilter === "health"}
            onOpenChange={(isOpen) => setOpenFilter(isOpen ? "health" : null)}
          />

          {hasActiveFilters && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredCustomers.length })}
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

        <CustomersMobileList
          rows={filteredCustomers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedCustomer && <CustomerDetailMobile customer={selectedCustomer} onClose={() => setSelectedId(null)} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since the column-alignment polish stage */}
      <CustomersDesktop
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        segmentFilter={segmentFilter}
        onSegmentChange={setSegmentFilter}
        healthFilter={healthFilter}
        onHealthChange={setHealthFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        openFilter={openFilter}
        onOpenFilterChange={setOpenFilter}
        filteredCustomers={filteredCustomers}
        selectedId={selectedId}
        onSelectRow={setSelectedId}
        selectedCustomer={selectedCustomer}
        onCloseDetail={() => setSelectedId(null)}
      />
    </>
  );
}
