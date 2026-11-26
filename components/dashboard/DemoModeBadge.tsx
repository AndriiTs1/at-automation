import { useTranslations } from "next-intl";

export default function DemoModeBadge() {
  const t = useTranslations("Dashboard.Topbar");

  return (
    <span
      title={t("demoDescription")}
      className="inline-flex w-fit max-w-full items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold leading-4 text-amber-800"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
      />
      {t("demoMode")}
    </span>
  );
}
