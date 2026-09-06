import { setRequestLocale } from "next-intl/server";
import AutomationsDesktop from "@/components/demo/automations/AutomationsDesktop";

export default async function AutomationsPage(props: PageProps<"/[locale]/demo/automations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <AutomationsDesktop />;
}
