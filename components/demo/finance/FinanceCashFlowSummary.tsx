import { useTranslations } from "next-intl";
import { getReceivablesAging } from "@/lib/demo-data";

function formatChf(amount: number) {
  return `CHF ${amount.toLocaleString("en-US")}`;
}

const BUCKETS = [
  { key: "overdue", labelKey: "summary.overdue", color: "bg-red-500" },
  { key: "dueSoon", labelKey: "cashFlow.dueSoon", color: "bg-amber-500" },
  { key: "dueLater", labelKey: "cashFlow.dueLater", color: "bg-[#3c587d]" },
] as const;

/** Global receivables aging, independent of active invoice filters. */
export default function FinanceCashFlowSummary() {
  const t = useTranslations("Dashboard.Finance");
  const aging = getReceivablesAging();
  const total = BUCKETS.reduce(
    (sum, bucket) => sum + aging[bucket.key].amount,
    0
  );

  return (
    <div className="shrink-0 rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {t("cashFlow.title")}
        </h2>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-[#3c587d]"
          aria-hidden="true"
        >
          <path d="M3 3v18h18M7 14l4-4 4 3 6-7" />
        </svg>
      </div>

      <div className="mt-3">
        <p className="text-xs text-neutral-500">
          {t("summary.outstanding")}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {formatChf(total)}
        </p>
      </div>

      <div
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-neutral-100"
        aria-hidden="true"
      >
        {BUCKETS.map((bucket) => (
          <div
            key={bucket.key}
            className={bucket.color}
            style={{
              width: `${total > 0 ? aging[bucket.key].amount / total * 100 : 0}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {BUCKETS.map((bucket) => {
          const data = aging[bucket.key];

          return (
            <div
              key={bucket.key}
              className="flex min-w-0 items-center gap-2.5"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${bucket.color}`}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {t(bucket.labelKey)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {t("toolbar.resultCount", { count: data.count })}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                  {formatChf(data.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
