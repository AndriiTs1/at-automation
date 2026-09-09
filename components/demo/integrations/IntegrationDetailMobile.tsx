import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import type { IntegrationDefinition } from "@/lib/demo-data";
import { IntegrationInspectorBody, IntegrationMobileInspectorHeader } from "./IntegrationDetailContent";

/**
 * Full-screen Integration Detail overlay for tablet and mobile — migrated onto the shared
 * DetailInspectorShell's `variant="mobile"` (the same `fixed inset-0 z-[60]` full-screen surface
 * this component used to build by hand), composed with IntegrationMobileInspectorHeader and the
 * same IntegrationInspectorBody the desktop 420px inspector already uses. This drops the old
 * default IntegrationDetailContent export's large nested "used by AT" system → AT → modules
 * diagram (redundant with the Integrations page's own System Landscape strip) and its rounded
 * status pill, matching the restrained content/status language already shipped for
 * desktop/tablet — mobile-only change; the old default export stays in the file, unused here now,
 * but untouched, since IntegrationDetailPanel already reads Header/Body separately and nothing
 * else imports the default export.
 */
export default function IntegrationDetailMobile({
  integration,
  onClose,
}: {
  integration: IntegrationDefinition;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Integrations");

  return (
    <DetailInspectorShell
      variant="mobile"
      onClose={onClose}
      closeLabel={t("detail.close")}
      header={<IntegrationMobileInspectorHeader integration={integration} />}
    >
      <IntegrationInspectorBody integration={integration} />
    </DetailInspectorShell>
  );
}
