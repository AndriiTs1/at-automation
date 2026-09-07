import { setRequestLocale } from "next-intl/server";
import AutomationsWorkspace from "@/components/demo/automations/AutomationsWorkspace";

export default async function AutomationsPage(props: PageProps<"/[locale]/demo/automations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <AutomationsWorkspace />;
}
