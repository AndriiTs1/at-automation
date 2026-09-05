import { setRequestLocale } from "next-intl/server";
import OperationsDesktop from "@/components/demo/operations/OperationsDesktop";

export default async function OperationsPage(props: PageProps<"/[locale]/demo/operations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <OperationsDesktop />;
}
