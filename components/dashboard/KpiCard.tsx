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
    <div className="min-w-0 rounded-xl border border-border bg-surface p-2 shadow-sm shadow-black/5 @lg:p-2.5 @3xl:p-3">
      <div className={`mb-1 flex h-5 w-5 items-center justify-center rounded-md @lg:mb-1.5 @3xl:mb-1.5 @3xl:h-6 @3xl:w-6 ${TONE_CLASSES[tone]}`}>
        <DashboardIcon name={icon} className="h-3.5 w-3.5" />
      </div>
      <p className="truncate text-[10px] text-neutral-500 @3xl:text-xs">{label}</p>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <p className="shrink-0 text-sm font-bold whitespace-nowrap text-foreground @3xl:text-base">{value}</p>
        <span className={`min-w-0 truncate text-[10px] font-medium @3xl:text-xs ${TONE_CLASSES[tone].split(" ")[1]}`}>{delta}</span>
      </div>
    </div>
  );
}
