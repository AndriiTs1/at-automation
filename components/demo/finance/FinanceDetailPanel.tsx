import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import ScenarioReturnLink from "@/components/demo/scenario/ScenarioReturnLink";
import type { FinanceInvoice } from "@/lib/demo-data";
import { FinanceInspectorBody, FinanceInspectorHeader } from "./FinanceDetailContent";

/**
 * Desktop-only inspector — migrated to the shared DetailInspectorShell (Customers/Inventory
 * reference implementation). Composes the shell with the new FinanceInspectorHeader/
 * FinanceInspectorBody instead of the original FinanceDetailContent default export, which stays
 * untouched and keeps serving FinanceDetailMobile exactly as before — this migration is
 * desktop-only; Finance mobile is approved and unchanged.
 */
export default function FinanceDetailPanel({
  invoice,
  onClose,
}: {
  invoice: FinanceInvoice;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Finance");

  return (
    <DetailInspectorShell
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      scenarioSlot={<ScenarioReturnLink className="shrink-0 px-5 pt-5" />}
      header={<FinanceInspectorHeader invoice={invoice} />}
    >
      <FinanceInspectorBody invoice={invoice} />
    </DetailInspectorShell>
  );
}
