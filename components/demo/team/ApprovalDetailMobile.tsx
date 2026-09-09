import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import { ApprovalInspectorBody, ApprovalInspectorHeader, type ApprovalDecision, type ApprovalItem } from "./ApprovalDetailContent";

/**
 * Full-screen approval detail overlay for tablet and mobile — composes the shared
 * DetailInspectorShell's `variant="mobile"` (the same `fixed inset-0 z-[60]` full-screen surface
 * every other module's own mobile detail already uses), with the same ApprovalInspectorHeader/
 * ApprovalInspectorBody the desktop 420px inspector renders — no duplicated detail JSX, no
 * separate mobile business logic.
 */
export default function ApprovalDetailMobile({
  approval,
  decision,
  onApprove,
  onReject,
  onClose,
}: {
  approval: ApprovalItem;
  decision: ApprovalDecision;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.TeamApprovals");

  return (
    <DetailInspectorShell
      variant="mobile"
      onClose={onClose}
      closeLabel={t("detail.close")}
      header={<ApprovalInspectorHeader approval={approval} decision={decision} />}
    >
      <ApprovalInspectorBody approval={approval} decision={decision} onApprove={onApprove} onReject={onReject} />
    </DetailInspectorShell>
  );
}
