import { useTranslations } from "next-intl";
import DetailInspectorShell from "@/components/demo/DetailInspectorShell";
import ScenarioReturnLink from "@/components/demo/scenario/ScenarioReturnLink";
import type { InventoryItem } from "@/lib/demo-data";
import { InventoryInspectorBody, InventoryInspectorHeader } from "./InventoryDetailContent";

/**
 * Desktop-only inspector — migrated to the shared DetailInspectorShell (Customers reference
 * implementation). Composes the shell with the new restrained Inventory header/body
 * (InventoryInspectorHeader/InventoryInspectorBody) instead of the original
 * InventoryDetailContent default export, which stays untouched and keeps serving
 * InventoryDetailMobile exactly as before — this redesign is desktop-only.
 */
export default function InventoryDetailPanel({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const t = useTranslations("Dashboard.Inventory");

  return (
    <DetailInspectorShell
      variant="desktop"
      onClose={onClose}
      closeLabel={t("detail.close")}
      scenarioSlot={<ScenarioReturnLink className="shrink-0 px-5 pt-5" />}
      header={<InventoryInspectorHeader item={item} />}
    >
      <InventoryInspectorBody item={item} />
    </DetailInspectorShell>
  );
}
