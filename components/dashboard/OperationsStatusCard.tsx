import { useTranslations } from "next-intl";
import { getOperationsStatusBreakdown, OPERATIONS_SUMMARY } from "@/lib/demo-data";

const STATUS_TEXT: Record<string, string> = {
  inProgress: "text-accent",
  waiting: "text-warning",
  attention: "text-error",
  completed: "text-success",
};

const STATUS_DOT: Record<string, string> = {
  inProgress: "bg-accent",
  waiting: "bg-warning",
  attention: "bg-error",
  completed: "bg-success",
};

const RING_SIZE = 72;
const STROKE = 9;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Compact donut + legend inspired by Germes Inventory Status, applied to AT's own Operations
 * status distribution rather than an inventory concept. Segment colors reuse the exact tone
 * mapping OperationsTable.tsx already assigns to these four statuses (accent/warning/error/
 * success) — not a new parallel color scheme — so this card and the Operations module always
 * agree on what each status means visually. Percentages come from getOperationsStatusBreakdown(),
 * a deterministic count over the real OPERATIONS_ROWS sample; nothing here is randomized or
 * invented.
 */
export default function OperationsStatusCard() {
  const t = useTranslations("Dashboard.OperationsStatus");
  const tStatus = useTranslations("Dashboard.Operations.status");
  const tKpi = useTranslations("Dashboard.Kpi");
  const breakdown = getOperationsStatusBreakdown();
  const summary = breakdown.map((segment) => `${tStatus(segment.status)} ${segment.pct}%`).join(", ");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @3xl:p-4">
      <h3 className="truncate text-[13px] font-semibold tracking-tight text-slate-900 @3xl:text-sm">{t("title")}</h3>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-lg leading-none font-semibold tracking-tight text-slate-900 @3xl:text-xl">
          {OPERATIONS_SUMMARY.active}
        </span>
        <span className="truncate text-[11px] text-slate-400 @3xl:text-xs">{tKpi("items.openOperations")}</span>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-2">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="-rotate-90 shrink-0"
          role="img"
          aria-label={summary}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            className="fill-none stroke-slate-100"
          />
          {breakdown.map((segment, index) => {
            const cumulativePct = breakdown.slice(0, index).reduce((sum, s) => sum + s.pct, 0);
            const dash = (segment.pct / 100) * CIRCUMFERENCE;
            const offset = -(cumulativePct / 100) * CIRCUMFERENCE;
            return (
              <circle
                key={segment.status}
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE}
                stroke="currentColor"
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={offset}
                className={`fill-none ${STATUS_TEXT[segment.status]}`}
              />
            );
          })}
        </svg>

        <ul className="min-w-0 flex-1 space-y-1">
          {breakdown.map((segment) => (
            <li key={segment.status} className="flex items-center justify-between gap-2 text-[10.5px] @3xl:text-[11px]">
              <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[segment.status]}`} />
                <span className="truncate">{tStatus(segment.status)}</span>
              </span>
              <span className="shrink-0 font-medium text-slate-900">{segment.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
