import { setRequestLocale } from "next-intl/server";
import DemoCommandCenterContent from "@/components/demo/DemoCommandCenterContent";

export default async function DemoPage(props: PageProps<"/[locale]/demo">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <DemoCommandCenterContent />;
}
