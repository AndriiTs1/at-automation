import { setRequestLocale } from "next-intl/server";
import ReportsWorkspace from "@/components/demo/reports/ReportsWorkspace";

export default async function ReportsPage(props: PageProps<"/[locale]/demo/reports">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <ReportsWorkspace />;
}
