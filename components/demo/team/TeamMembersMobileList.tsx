import { useTranslations } from "next-intl";
import { TEAM_MEMBERS } from "@/lib/demo-data";
import { areaLabel } from "./teamFormatters";

const MEMBER_STATUS_TONE: Record<string, string> = {
  active: "bg-success/10 text-success",
  away: "bg-neutral-200 text-neutral-600",
};

/**
 * Dense stacked team-member card list for mobile (Stage 2I.2) — reuses TEAM_MEMBERS directly, the
 * same 4 members the desktop table already shows. Open-items and responsibility area labels are
 * never re-typed here, only formatted.
 */
export default function TeamMembersMobileList() {
  const t = useTranslations("Dashboard.TeamApprovals");
  const tDashboard = useTranslations("Dashboard");
  const tSidebar = useTranslations("Dashboard.Sidebar");

  const roleLabel = (role: string) => (role === "managingDirector" ? tDashboard("role") : t(`roles.${role}`));

  return (
    <ul className="flex flex-col gap-2">
      {TEAM_MEMBERS.map((member) => (
        <li key={member.id} className="rounded-xl border border-border bg-surface p-3 shadow-sm shadow-black/5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
                {member.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                <p className="truncate text-xs text-neutral-500">{roleLabel(member.role)}</p>
              </div>
            </div>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${MEMBER_STATUS_TONE[member.status]}`}
            >
              {t(`status.${member.status}`)}
            </span>
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">{t("team.columns.responsibleFor")}</p>
              <p className="text-xs break-words text-neutral-700">
                {member.areaKeys.map((key) => areaLabel(key, tSidebar, t)).join(" · ")}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-neutral-400">{t("team.columns.openItems")}</p>
              <p className="text-sm font-semibold text-foreground">{member.openItems}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
