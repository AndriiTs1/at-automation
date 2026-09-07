import { setRequestLocale } from "next-intl/server";
import IntegrationsWorkspace from "@/components/demo/integrations/IntegrationsWorkspace";

export default async function IntegrationsPage(props: PageProps<"/[locale]/demo/integrations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <IntegrationsWorkspace />;
}
