import { useTranslations } from "next-intl";
import { CHART_SERIES, KPI_ITEMS } from "@/lib/demo-data";

type Point = { x: number; y: number };

function parsePoints(pointsStr: string): Point[] {
  return pointsStr.split(" ").map((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return { x, y };
  });
}

/**
 * Catmull-Rom to cubic-Bezier — a small, dependency-free way to draw a smooth curve through the
 * existing CHART_SERIES points, in place of the straight polyline segments the full-size chart
 * uses. Purely a rendering transform: same coordinates, no data change, no new dependency.
 */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Revenue is the primary series (it's also the KPI shown above the chart): a filled area and the
 * boldest, fully-opaque line. Operations/Profit stay as clean, slightly thinner accent lines with
 * no fill of their own — three overlapping translucent fills were what made the previous version
 * look muddy; a single clean fill under the hero line reads far more like Germes' own compact
 * charts while still keeping all three series visible.
 */
const SERIES_KEYS = [
  { key: "revenue", points: CHART_SERIES.revenue, className: "text-accent", strokeWidth: 3, fill: true, opacity: 1 },
  { key: "operations", points: CHART_SERIES.operations, className: "text-success", strokeWidth: 2, fill: false, opacity: 0.8 },
  { key: "profit", points: CHART_SERIES.profit, className: "text-warning", strokeWidth: 2, fill: false, opacity: 0.8 },
] as const;

/**
 * Compact executive card for the Command Center's analytics row — Germes Sales Performance's
 * card hierarchy (title / big number / restrained legend / bare bottom-anchored chart), applied
 * to AT's own existing three-series revenue/operations/profit data. Reuses the exact same
 * CHART_SERIES point coordinates as the full-size BusinessPerformance (same coordinate space,
 * same viewBox), just rendered at a fraction of the height with the grid lines, axis labels, and
 * tooltip stripped out — nothing about the underlying data changes, only how much of it a
 * deliberately smaller executive tile chooses to surface at a glance.
 */
export default function BusinessPerformanceCompact() {
  const t = useTranslations("Dashboard.Performance");
  const revenue = KPI_ITEMS.find((item) => item.key === "revenue");
  const seriesPaths = SERIES_KEYS.map((s) => ({ ...s, path: smoothPath(parsePoints(s.points)) }));

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-demo-card @3xl:p-4">
      <h3 className="truncate text-center text-[13px] font-semibold tracking-tight text-slate-900 @3xl:text-sm">{t("title")}</h3>

      <div className="mt-1.5 flex items-baseline justify-center gap-1.5">
        <span className="text-lg leading-none font-semibold tracking-tight text-slate-900 @3xl:text-xl">
          {revenue?.value}
        </span>
        {revenue && "deltaValue" in revenue && (
          <span className="text-[11px] leading-none font-medium text-success @3xl:text-xs">{revenue.deltaValue}</span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
        {SERIES_KEYS.map((s) => (
          <span key={s.key} className="flex items-center gap-1 truncate text-[10px] text-slate-400">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${s.className}`} />
            {t(`series.${s.key}`)}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <svg
          viewBox="0 0 700 200"
          className="h-11 w-full @3xl:h-14"
          preserveAspectRatio="none"
          role="img"
          aria-label={t("chartAria")}
        >
          {seriesPaths.map(
            (s) =>
              s.fill && (
                <path
                  key={`${s.key}-area`}
                  d={`${s.path} L 680 170 L 50 170 Z`}
                  className={s.className}
                  fill="currentColor"
                  opacity="0.14"
                />
              ),
          )}
          {seriesPaths.map((s) => (
            <path
              key={s.key}
              d={s.path}
              fill="none"
              stroke="currentColor"
              className={s.className}
              strokeWidth={s.strokeWidth}
              strokeOpacity={s.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
