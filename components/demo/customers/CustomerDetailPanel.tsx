import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import ScenarioReturnLink from "@/components/demo/scenario/ScenarioReturnLink";
import type { CustomerRow } from "@/lib/demo-data";
import { CustomerInspectorBody, CustomerInspectorHeader } from "./CustomerDetailContent";

/**
 * Desktop-only inspector — Stage 1 reference implementation of DetailInspectorShell (the shared
 * ChatGPT-inspired inspector shell). Composes the shell directly with the new restrained
 * Customer header/body (CustomerInspectorHeader/CustomerInspectorBody) instead of the original
 * CustomerDetailContent default export, which stays untouched and keeps serving
 * CustomerDetailMobile exactly as before — this redesign is desktop-only for Stage 1.
 */
export default function CustomerDetailPanel({
  customer,
  onClose,
}: {
  customer: CustomerRow;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Customers");

  return (
    <DetailInspectorShell
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      scenarioSlot={<ScenarioReturnLink className="shrink-0 px-5 pt-5" />}
      header={<CustomerInspectorHeader customer={customer} />}
    >
      <CustomerInspectorBody customer={customer} />
    </DetailInspectorShell>
  );
}
