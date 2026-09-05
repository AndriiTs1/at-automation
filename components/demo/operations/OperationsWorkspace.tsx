"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/dashboard/icons";
import { OPERATIONS_ROWS, OPERATION_OWNERS, type OperationStatus } from "@/lib/demo-data";
import OperationDetailPanel from "./OperationDetailPanel";
import OperationsTable from "./OperationsTable";

const STATUS_OPTIONS: OperationStatus[] = ["inProgress", "waiting", "attention", "completed"];

type StatusFilterValue = OperationStatus | "all";

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

  // Reset selection when the active filters change and the previously-selected row
  // is no longer among the results — computed during render, per React's guidance
  // for adjusting state from a changing input rather than via an Effect.
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
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex w-64 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent/30">
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
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="text-xs text-neutral-400">{t("toolbar.resultCount", { count: filteredOperations.length })}</span>
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

      {/* Table + detail panel */}
      <div className="flex min-h-0 flex-1 gap-3">
        <OperationsTable
          rows={filteredOperations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
        {selectedOperation && <OperationDetailPanel operation={selectedOperation} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
}
