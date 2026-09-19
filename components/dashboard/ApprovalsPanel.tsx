import { useTranslations } from "next-intl";
import { APPROVALS } from "@/lib/demo-data";

export default function ApprovalsPanel() {
  const t = useTranslations("Dashboard.Approvals");
  const tTeams = useTranslations("Dashboard.Teams");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-demo-card @3xl:p-4">
      <h4 className="mb-1.5 shrink-0 truncate text-xs font-semibold tracking-tight text-slate-900 @3xl:mb-2 @3xl:text-sm">{t("title")}</h4>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto @3xl:gap-2">
        {APPROVALS.map((item) => {
          const dept = tTeams(item.deptKey);
          const requester = "requesterName" in item ? `${item.requesterName} · ${dept}` : dept;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-2 py-1.5 text-[11px] @3xl:text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{t(`items.${item.key}`)}</p>
                <p className="text-slate-500 @lg:truncate">
                  <span className="font-semibold text-slate-900">{item.amount}</span> · {requester}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-blue-600/20 px-2.5 py-1 text-[10px] font-medium text-blue-600 transition-colors hover:bg-blue-50 @3xl:text-[11px]"
              >
                {t("review")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-1.5 shrink-0 truncate text-[10px] text-slate-400 @3xl:mt-2 @3xl:text-[11px]">
        {t("awaitingApproval", { count: APPROVALS.length })}
      </p>
    </div>
  );
}
