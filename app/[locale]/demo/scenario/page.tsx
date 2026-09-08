import { setRequestLocale } from "next-intl/server";
import ScenarioWorkspace from "@/components/demo/scenario/ScenarioWorkspace";

export default async function ScenarioPage(props: PageProps<"/[locale]/demo/scenario">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <ScenarioWorkspace />;
}
