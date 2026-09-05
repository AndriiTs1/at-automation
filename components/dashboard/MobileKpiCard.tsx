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
    <div className="min-w-0 rounded-xl border border-border bg-surface p-1.5 shadow-sm shadow-black/5">
      <div className={`mb-1 flex h-4 w-4 items-center justify-center rounded-md ${TONE_CLASSES[tone]}`}>
        <DashboardIcon name={icon} className="h-2.5 w-2.5" />
      </div>
      <p className="line-clamp-2 min-h-[25px] text-[10px] leading-[1.25] font-medium text-neutral-500">{label}</p>
      <p className="mt-0.5 truncate text-lg leading-tight font-bold text-foreground">{value}</p>
      <p className={`mt-0.5 truncate text-[11px] leading-tight font-medium ${TONE_CLASSES[tone].split(" ")[1]}`}>{delta}</p>
    </div>
  );
}
