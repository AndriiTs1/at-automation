import { useTranslations } from "next-intl";
import { APPROVALS } from "@/lib/demo-data";

export default function ApprovalsPanel() {
  const t = useTranslations("Dashboard.Approvals");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-2.5 shadow-sm shadow-black/5 @3xl:p-4">
      <h4 className="mb-1.5 shrink-0 truncate text-xs font-semibold text-foreground @3xl:mb-2 @3xl:text-sm">{t("title")}</h4>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto @3xl:gap-2">
        {APPROVALS.map((item) => {
          const dept = tTeams(item.deptKey);
          const requester = "requesterName" in item ? `${item.requesterName} · ${dept}` : dept;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2 py-1.5 text-[11px] @3xl:text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{t(`items.${item.key}`)}</p>
                <p className="text-neutral-500 @lg:truncate">
                  <span className="font-semibold text-foreground">{item.amount}</span> · {requester}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-accent/30 px-2.5 py-1 text-[10px] font-medium text-accent transition-colors hover:bg-accent/10 @3xl:text-[11px]"
              >
                {t("review")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-1.5 shrink-0 truncate text-[10px] text-neutral-400 @3xl:mt-2 @3xl:text-[11px]">
        {t("awaitingApproval", { count: APPROVALS.length })}
      </p>
    </div>
  );
}
