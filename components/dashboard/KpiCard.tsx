import { useTranslations } from "next-intl";
import { DashboardIcon } from "./icons";

type KpiTone = "success" | "warning" | "error" | "accent";

const TONE_CLASSES: Record<KpiTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  accent: "bg-accent/10 text-accent",
};

type KpiCardProps = {
  itemKey: string;
  value: string;
  deltaKind: "percent" | "overdue" | "saved";
  deltaValue?: string;
  deltaCount?: number;
  deltaHours?: string;
  tone: KpiTone;
  icon: string;
};

export default function KpiCard({ itemKey, value, deltaKind, deltaValue, deltaCount, deltaHours, tone, icon }: KpiCardProps) {
  const t = useTranslations("Dashboard.Kpi");

  const label = t(`items.${itemKey}`);
  const delta =
    deltaKind === "percent"
      ? (deltaValue ?? "")
      : deltaKind === "overdue"
        ? t("overdue", { count: deltaCount ?? 0 })
        : t("saved", { hours: deltaHours ?? "" });

  return (
    <div className="flex min-h-[130px] min-w-0 flex-col rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-demo-card @lg:p-3 @3xl:p-3.5">
      {/*
        The card's `min-h` is deliberately taller than the content wrapper below, so this
        `justify-center` has real free space to work with and vertically centers the ENTIRE
        wrapper (icon + label + value/delta) as one unit, top and bottom slack equal — see
        MobileKpiCard.tsx for the mobile version. The wrapper itself keeps the original approved
        internal spacing and stays `w-full` so nothing shifts horizontally.
      */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-[10px] @3xl:h-7 @3xl:w-7 ${TONE_CLASSES[tone]}`}>
          <DashboardIcon name={icon} className="h-3.5 w-3.5" />
        </div>
        <p className="truncate text-[10px] font-medium text-slate-500 @3xl:text-xs">{label}</p>
        <div className="mt-1.5 flex min-w-0 items-baseline justify-center gap-1.5">
          {/*
            leading-tight on both nodes of this final row only: the default paired line-height for
            text-base/text-xl (and text-xs) reserves invisible space below the glyphs that the first
            item in the stack (the icon, a plain box with no line-height) has no equivalent of — that
            asymmetry, not the flex centering, is what read as "too high". Tightening just this row
            removes the excess leading at its source instead of compensating for it elsewhere.
          */}
          <p className="shrink-0 text-base leading-none font-semibold tracking-tight whitespace-nowrap text-slate-900 @3xl:text-xl">{value}</p>
          <span className={`min-w-0 truncate text-[10px] leading-none font-medium @3xl:text-xs ${TONE_CLASSES[tone].split(" ")[1]}`}>{delta}</span>
        </div>
      </div>
    </div>
  );
}
