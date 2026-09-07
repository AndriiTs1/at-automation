import { useTranslations } from "next-intl";
import { CHART_DATES, CHART_SERIES, CHART_TOOLTIP } from "@/lib/demo-data";

const GRID_LINES = [
  { y: 20, label: "80K" },
  { y: 58, label: "60K" },
  { y: 95, label: "40K" },
  { y: 133, label: "20K" },
  { y: 170, label: "0" },
];

const X_POSITIONS = [50, 155, 260, 365, 470, 575, 680];

/** Indices kept when `compact` thins the x-axis to 4 labels (8 Aug/18 Aug/28 Aug/6 Sep) — the
 * underlying 7 plotted points and their CHART_DATES never change, only which labels render. */
const COMPACT_LABEL_INDICES = new Set([0, 2, 4, 6]);

const SERIES_KEYS = [
  { key: "revenue", points: CHART_SERIES.revenue, className: "text-accent" },
  { key: "operations", points: CHART_SERIES.operations, className: "text-success" },
  { key: "profit", points: CHART_SERIES.profit, className: "text-warning" },
] as const;

/**
 * Larger, filter-free version of the Command Center Business Performance chart (Stage 2H.1) —
 * reuses the exact same CHART_SERIES/CHART_DATES/CHART_TOOLTIP data plus the series/legend/aria
 * translations, so Reports can never show a trend that disagrees with Command Center. Omits the
 * "Last 30 days" range-filter button: Reports has no filters yet, and the fixed period is already
 * shown once at the page level.
 *
 * `compact` (Stage 2H.2, default false — desktop's own call site never passes it, so desktop
 * output is byte-for-byte unchanged) thins the x-axis down to 4 of the 7 labels for narrow mobile
 * widths, where all 7 "D Mon" labels would collide. All 7 data points still plot; only label
 * density changes.
 */
export default function ReportsBusinessPerformance({ compact = false }: { compact?: boolean } = {}) {
  const t = useTranslations("Dashboard.Performance");
  const tReports = useTranslations("Dashboard.Reports");

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm shadow-black/5 ${compact ? "p-3" : "p-4"}`}
    >
      <div className="mb-2 shrink-0">
        <h4 className="text-sm font-semibold text-foreground">{tReports("performance.title")}</h4>
        <p className="text-xs text-neutral-500">{tReports("performance.subtitle")}</p>
      </div>

      <div className="mb-2 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
        {SERIES_KEYS.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 truncate text-xs text-neutral-500">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${s.className}`} />
            {t(`series.${s.key}`)}
          </span>
        ))}
      </div>

      <svg
        viewBox="0 0 700 200"
        className="min-h-0 w-full flex-1"
        preserveAspectRatio="none"
        role="img"
        aria-label={t("chartAria")}
      >
        {GRID_LINES.map((line) => (
          <g key={line.label}>
            <line x1="40" y1={line.y} x2="695" y2={line.y} stroke="currentColor" className="text-black/5" strokeWidth="1" />
            <text x="0" y={line.y + 3} fontSize="9" className="fill-neutral-400">
              {line.label}
            </text>
          </g>
        ))}

        {SERIES_KEYS.map((s) => (
          <polygon
            key={`${s.key}-area`}
            points={`${s.points} 680,170 50,170`}
            className={s.className}
            fill="currentColor"
            opacity="0.05"
          />
        ))}
        {SERIES_KEYS.map((s) => (
          <polyline
            key={s.key}
            points={s.points}
            fill="none"
            stroke="currentColor"
            className={s.className}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Static tooltip marker for realism — same established decoration as Command Center's
            own Business Performance chart, not a new interactive feature. */}
        <circle cx="575" cy="35" r="3.5" className="text-accent" fill="currentColor" />
        <g transform="translate(500,2)">
          <rect width="90" height="26" rx="6" className="fill-foreground" opacity="0.92" />
          <text x="8" y="11" fontSize="8" className="fill-white" opacity="0.7">
            {CHART_TOOLTIP.date}
          </text>
          <text x="8" y="21" fontSize="9" fontWeight="600" className="fill-white">
            {t("tooltipRevenue", { value: CHART_TOOLTIP.value })}
          </text>
        </g>

        {X_POSITIONS.map((x, i) => {
          if (compact && !COMPACT_LABEL_INDICES.has(i)) return null;
          return (
            <text key={CHART_DATES[i]} x={x} y="192" fontSize="9" textAnchor="middle" className="fill-neutral-400">
              {CHART_DATES[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
