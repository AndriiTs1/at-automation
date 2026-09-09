import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import type { IntegrationDefinition } from "@/lib/demo-data";
import { IntegrationInspectorBody, IntegrationInspectorHeader } from "./IntegrationDetailContent";

/**
 * Desktop-only inspector — migrated to the shared DetailInspectorShell (Customers/Inventory/
 * Finance/Automations reference implementation). Composes the shell with the restrained
 * IntegrationInspectorHeader/IntegrationInspectorBody instead of the original
 * IntegrationDetailContent default export, which stays untouched and keeps serving
 * IntegrationDetailMobile exactly as before — this migration is desktop-only. Integrations has no
 * Scenario deep link, so unlike Automations/Inventory/Finance there is no scenarioSlot to render.
 */
export default function IntegrationDetailPanel({
  integration,
  onClose,
}: {
  integration: IntegrationDefinition;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Integrations");

  return (
    <DetailInspectorShell
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      header={<IntegrationInspectorHeader integration={integration} />}
    >
      <IntegrationInspectorBody integration={integration} />
    </DetailInspectorShell>
  );
}
