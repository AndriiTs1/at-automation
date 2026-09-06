import { setRequestLocale } from "next-intl/server";
import InventoryDesktop from "@/components/demo/inventory/InventoryDesktop";

export default async function InventoryPage(props: PageProps<"/[locale]/demo/inventory">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <InventoryDesktop />;
}
