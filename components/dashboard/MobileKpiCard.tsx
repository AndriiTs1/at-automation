import { useTranslations } from "next-intl";
import { DashboardIcon } from "./icons";

type KpiTone = "success" | "warning" | "error" | "accent";

const TONE_CLASSES: Record<KpiTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  accent: "bg-accent/10 text-accent",
};

type MobileKpiCardProps = {
  itemKey: string;
  value: string;
  deltaKind: "percent" | "overdue" | "saved";
  deltaValue?: string;
  deltaCount?: number;
  deltaHours?: string;
  tone: KpiTone;
  icon: string;
};

export default function MobileKpiCard({
  itemKey,
  value,
  deltaKind,
  deltaValue,
  deltaCount,
  deltaHours,
  tone,
  icon,
}: MobileKpiCardProps) {
  const t = useTranslations("Dashboard.Kpi");

  const label = t(`items.${itemKey}`);
  const delta =
    deltaKind === "percent"
      ? (deltaValue ?? "")
      : deltaKind === "overdue"
        ? t("overdue", { count: deltaCount ?? 0 })
        : t("saved", { hours: deltaHours ?? "" });

  return (
    <div className="flex min-h-[123px] min-w-0 flex-col rounded-2xl border border-slate-200/70 bg-white p-2 shadow-demo-card">
      {/*
        The card's `min-h` is deliberately taller than the content wrapper below, so this
        `justify-center` has real free space to work with and vertically centers the ENTIRE
        wrapper (icon, label, value, delta) as one unit, top and bottom slack equal — see
        KpiCard.tsx for the desktop/tablet version. The wrapper itself keeps the original approved
        internal spacing and stays `w-full` so nothing shifts horizontally.
      */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className={`mb-1.5 flex h-5 w-5 items-center justify-center rounded-[10px] ${TONE_CLASSES[tone]}`}>
          <DashboardIcon name={icon} className="h-3 w-3" />
        </div>
        <p className="line-clamp-2 min-h-[25px] text-[10px] leading-[1.25] font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-lg leading-tight font-semibold tracking-tight text-slate-900">{value}</p>
        {/*
          leading-none (not leading-tight) specifically on this last row: it's already the tightest
          named step below leading-tight, needed because — unlike a text row in the middle of the
          stack — this one's bottom half-leading has no counterpart at the very top of the stack
          (the first item is an icon box, not text), so it's the direct source of the "too high"
          look. leading-tight was tried already and wasn't tight enough; leading-none is exact
          em-box and still fully readable at 11px.
        */}
        <p className={`mt-0.5 truncate text-[11px] leading-none font-medium ${TONE_CLASSES[tone].split(" ")[1]}`}>{delta}</p>
      </div>
    </div>
  );
}
