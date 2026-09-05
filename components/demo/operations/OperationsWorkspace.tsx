"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/dashboard/icons";
import { OPERATIONS_ROWS, OPERATIONS_SUMMARY, OPERATION_OWNERS, type OperationStatus } from "@/lib/demo-data";
import OperationDetailMobile from "./OperationDetailMobile";
import OperationsDesktop, { type StatusFilterValue } from "./OperationsDesktop";
import OperationsMobileList from "./OperationsMobileList";

const STATUS_OPTIONS: OperationStatus[] = ["inProgress", "waiting", "attention", "completed"];

const SUMMARY_ITEMS = [
  { key: "active", value: OPERATIONS_SUMMARY.active, tone: "accent" },
  { key: "needsAttention", value: OPERATIONS_SUMMARY.needsAttention, tone: "error" },
  { key: "completedToday", value: OPERATIONS_SUMMARY.completedToday, tone: "success" },
  { key: "totalValue", value: OPERATIONS_SUMMARY.totalValue, tone: "accent" },
] as const;

const TONE_TEXT: Record<string, string> = {
  accent: "text-accent",
  success: "text-success",
  error: "text-error",
};

/** Compact 2x2 KPI grid shared by the mobile and tablet Operations sections. */
function SummaryGrid() {
  const t = useTranslations("Dashboard.Operations");
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
 * Top-level Operations workspace — owns all filtering/selection state and derives
 * filteredOperations once, then fans it out to three breakpoint-gated presentations
 * (mobile / tablet / desktop), mirroring the CSS-gating pattern already established by
 * DemoCommandCenterContent. OPERATIONS_ROWS stays the single, unfiltered source of truth.
 */
export default function OperationsWorkspace() {
  const t = useTranslations("Dashboard.Operations");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  const filteredOperations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return OPERATIONS_ROWS.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (ownerFilter !== "all" && row.owner !== ownerFilter) return false;
      if (!query) return true;
      const stageLabel = t(`stage.${row.stage}`).toLowerCase();
      return (
        row.id.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query) ||
        row.owner.toLowerCase().includes(query) ||
        stageLabel.includes(query)
      );
    });
  }, [searchQuery, statusFilter, ownerFilter, t]);

  // Reset selection when the active filters change and the previously-selected row is no
  // longer among the results — computed during render, per React's guidance for adjusting
  // state from a changing input rather than via an Effect.
  const filterKey = `${searchQuery}|${statusFilter}|${ownerFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (selectedId && !filteredOperations.some((row) => row.id === selectedId)) {
      setSelectedId(null);
    }
  }

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || ownerFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setOwnerFilter("all");
  };

  const selectedOperation = filteredOperations.find((row) => row.id === selectedId) ?? null;

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

          <div className="grid grid-cols-2 gap-2">
            <div className="relative flex items-center">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilterValue)}
                aria-label={t("toolbar.allStatuses")}
                className="w-full appearance-none rounded-full border border-border bg-surface py-2 pr-7 pl-3 text-xs text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <option value="all">{t("toolbar.allStatuses")}</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {t(`status.${status}`)}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-3 w-3 text-neutral-400" />
            </div>

            <div className="relative flex items-center">
              <select
                value={ownerFilter}
                onChange={(event) => setOwnerFilter(event.target.value)}
                aria-label={t("toolbar.allOwners")}
                className="w-full appearance-none rounded-full border border-border bg-surface py-2 pr-7 pl-3 text-xs text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <option value="all">{t("toolbar.allOwners")}</option>
                {OPERATION_OWNERS.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-3 w-3 text-neutral-400" />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredOperations.length })}
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

        <OperationsMobileList
          rows={filteredOperations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedOperation && <OperationDetailMobile operation={selectedOperation} onClose={() => setSelectedId(null)} />}
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
            {t("newOperation")}
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

          <div className="relative flex shrink-0 items-center">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilterValue)}
              aria-label={t("toolbar.allStatuses")}
              className="appearance-none rounded-full border border-border bg-surface py-2 pr-8 pl-3 text-sm text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              <option value="all">{t("toolbar.allStatuses")}</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {t(`status.${status}`)}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-neutral-400" />
          </div>

          <div className="relative flex shrink-0 items-center">
            <select
              value={ownerFilter}
              onChange={(event) => setOwnerFilter(event.target.value)}
              aria-label={t("toolbar.allOwners")}
              className="appearance-none rounded-full border border-border bg-surface py-2 pr-8 pl-3 text-sm text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              <option value="all">{t("toolbar.allOwners")}</option>
              {OPERATION_OWNERS.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-neutral-400" />
          </div>

          {hasActiveFilters && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-neutral-400">
                {t("toolbar.resultCount", { count: filteredOperations.length })}
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

        <OperationsMobileList
          rows={filteredOperations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {selectedOperation && <OperationDetailMobile operation={selectedOperation} onClose={() => setSelectedId(null)} />}
      </div>

      {/* Desktop workspace (@5xl and up) — unchanged since Stage 2B.3 */}
      <OperationsDesktop
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        ownerFilter={ownerFilter}
        onOwnerChange={setOwnerFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        filteredOperations={filteredOperations}
        selectedId={selectedId}
        onSelectRow={setSelectedId}
        selectedOperation={selectedOperation}
        onCloseDetail={() => setSelectedId(null)}
      />
    </>
  );
}
