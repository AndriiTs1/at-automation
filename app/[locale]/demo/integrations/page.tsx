import { setRequestLocale } from "next-intl/server";
import IntegrationsDesktop from "@/components/demo/integrations/IntegrationsDesktop";

export default async function IntegrationsPage(props: PageProps<"/[locale]/demo/integrations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <IntegrationsDesktop />;
}
