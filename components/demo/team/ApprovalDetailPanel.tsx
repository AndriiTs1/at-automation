import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import { ApprovalInspectorBody, ApprovalInspectorHeader, type ApprovalDecision, type ApprovalItem } from "./ApprovalDetailContent";

/**
 * Desktop-only inspector — composes the shared DetailInspectorShell (Customers/Inventory/Finance/
 * Automations/Integrations reference implementation): 420px, border-left, white surface, no
 * rounded outer card, no outer shadow, real flex sibling (not an overlay). Approvals has no
 * Scenario deep link, so — like Integrations — there is no scenarioSlot to render.
 */
export default function ApprovalDetailPanel({
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
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      header={<ApprovalInspectorHeader approval={approval} decision={decision} />}
    >
      <ApprovalInspectorBody approval={approval} decision={decision} onApprove={onApprove} onReject={onReject} />
    </DetailInspectorShell>
  );
}
