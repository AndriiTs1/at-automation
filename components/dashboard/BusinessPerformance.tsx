import { useTranslations } from "next-intl";
import { CHART_DATES, CHART_SERIES, CHART_TOOLTIP } from "@/lib/demo-data";
import { ChevronDownIcon } from "./icons";

const GRID_LINES = [
  { y: 20, label: "80K" },
  { y: 58, label: "60K" },
  { y: 95, label: "40K" },
  { y: 133, label: "20K" },
  { y: 170, label: "0" },
];

const X_POSITIONS = [50, 155, 260, 365, 470, 575, 680];

const SERIES_KEYS = [
  { key: "revenue", points: CHART_SERIES.revenue, className: "text-accent" },
  { key: "operations", points: CHART_SERIES.operations, className: "text-success" },
  { key: "profit", points: CHART_SERIES.profit, className: "text-warning" },
] as const;

export default function BusinessPerformance() {
  const t = useTranslations("Dashboard.Performance");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5 @3xl:p-4">
      <div className="mb-1 flex shrink-0 flex-wrap items-start justify-between gap-2 @3xl:mb-1.5">
        <div className="min-w-0">
          <h4 className="truncate text-xs font-semibold text-foreground @3xl:text-sm">{t("title")}</h4>
          <p className="hidden truncate text-[11px] text-neutral-500 @lg:block">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          aria-label={t("rangeFilterAria")}
          className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] text-neutral-500 transition-colors hover:bg-black/5 @3xl:text-[11px]"
        >
          <span className="whitespace-nowrap">{t("rangeLabel")}</span>
          <ChevronDownIcon className="h-3 w-3 shrink-0" />
        </button>
      </div>

      <div className="mb-1.5 hidden shrink-0 items-center gap-3 @lg:flex">
        {SERIES_KEYS.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 truncate text-[11px] text-neutral-500">
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

        {/* Static tooltip marker for realism */}
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

        {X_POSITIONS.map((x, i) => (
          <text key={CHART_DATES[i]} x={x} y="192" fontSize="9" textAnchor="middle" className="hidden fill-neutral-400 @3xl:block">
            {CHART_DATES[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}
