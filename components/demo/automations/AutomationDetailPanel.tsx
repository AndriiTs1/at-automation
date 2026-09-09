import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import ScenarioReturnLink from "@/components/demo/scenario/ScenarioReturnLink";
import type { AutomationDefinition } from "@/lib/demo-data";
import { AutomationInspectorBody, AutomationInspectorHeader } from "./AutomationDetailContent";

/**
 * Desktop-only inspector — migrated to the shared DetailInspectorShell (Customers/Inventory/
 * Finance reference implementation). Composes the shell with AutomationInspectorHeader/
 * AutomationInspectorBody instead of the original AutomationDetailContent default export, which
 * stays untouched and keeps serving AutomationDetailMobile exactly as before — this migration is
 * desktop-only; Automations mobile/tablet-list is untouched.
 */
export default function AutomationDetailPanel({
  automation,
  onClose,
}: {
  automation: AutomationDefinition;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Automations");

  return (
    <DetailInspectorShell
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      scenarioSlot={<ScenarioReturnLink className="shrink-0 px-5 pt-5" />}
      header={<AutomationInspectorHeader automation={automation} />}
    >
      <AutomationInspectorBody automation={automation} />
    </DetailInspectorShell>
  );
}
