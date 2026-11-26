import { DashboardIcon } from "@/components/dashboard/icons";
import { useTranslations } from "next-intl";
import { getOperationsStatusBreakdown } from "@/lib/demo-data";

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

const RING_SIZE = 112;
const STROKE = 12;
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
  const breakdown = getOperationsStatusBreakdown();
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);
  const summary = breakdown.map((segment) => `${tStatus(segment.status)} ${segment.pct}%`).join(", ");

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <DashboardIcon name="activity" className="h-4 w-4" />
        </span>
        {t("title")}
      </h3>

      <p className="mt-2 text-[11px] text-slate-500">
        {t("subtitle", { count: total })}
      </p>

      <div className="mt-4 flex flex-1 flex-wrap items-center justify-center gap-4">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="shrink-0"
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
            const cumulativePct = breakdown.slice(0, index).reduce((sum, s) => sum + s.count, 0);
            const dash = (segment.count / (total || 1)) * CIRCUMFERENCE;
            const offset = -(cumulativePct / (total || 1)) * CIRCUMFERENCE;
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
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                className={`fill-none ${STATUS_TEXT[segment.status]}`}
              />
            );
          })}
          <text
            x={RING_SIZE / 2}
            y={RING_SIZE / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-900 text-2xl font-semibold"
          >
            {total}
          </text>
        </svg>

        <ul className="min-w-[120px] flex-1 space-y-2.5">
          {breakdown.map((segment) => (
            <li key={segment.status} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[segment.status]}`} />
                <span>{tStatus(segment.status)}</span>
              </span>
              <span className="shrink-0 font-medium text-slate-900">{segment.count} · {segment.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
