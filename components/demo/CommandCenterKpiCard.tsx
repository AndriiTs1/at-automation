import { useTranslations } from "next-intl";
import { DashboardIcon } from "@/components/dashboard/icons";

type Tone = "success" | "warning" | "error" | "accent";

const TONES: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  accent: "text-accent",
};

type Props = {
  itemKey: string;
  value: string;
  deltaKind: "percent" | "overdue" | "saved";
  deltaValue?: string;
  deltaCount?: number;
  deltaHours?: string;
  tone: Tone;
  icon: string;
};

export default function CommandCenterKpiCard({
  itemKey, value, deltaKind, deltaValue,
  deltaCount, deltaHours, tone, icon,
}: Props) {
  const t = useTranslations("Dashboard.Kpi");

  const delta =
    deltaKind === "percent"
      ? (deltaValue ?? "")
      : deltaKind === "overdue"
        ? t("overdue", { count: deltaCount ?? 0 })
        : t("saved", { hours: deltaHours ?? "" });

  return (
    <div className="flex min-h-[104px] min-w-0 flex-col items-center justify-center gap-1.5 @5xl:flex-row @5xl:gap-3 rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5 @lg:gap-3 @lg:p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent @5xl:h-10 @5xl:w-10">
        <DashboardIcon name={icon} className="h-4 w-4 @5xl:h-5 @5xl:w-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
        <p className="text-xs leading-tight font-medium break-words text-neutral-500">
          {t(`items.${itemKey}`)}
        </p>
        <p className="mt-1 text-base leading-tight font-semibold tracking-tight whitespace-nowrap tabular-nums text-foreground @5xl:text-xl">
          {value}
        </p>
        <p className={`mt-1 text-xs leading-tight font-medium break-words ${TONES[tone]}`}>
          {delta}
        </p>
      </div>
    </div>
  );
}
