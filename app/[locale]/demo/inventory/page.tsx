import { setRequestLocale } from "next-intl/server";
import InventoryWorkspace from "@/components/demo/inventory/InventoryWorkspace";

export default async function InventoryPage(props: PageProps<"/[locale]/demo/inventory">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <InventoryWorkspace />;
}
