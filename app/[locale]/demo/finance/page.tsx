import { setRequestLocale } from "next-intl/server";
import FinanceDesktop from "@/components/demo/finance/FinanceDesktop";

export default async function FinancePage(props: PageProps<"/[locale]/demo/finance">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <FinanceDesktop />;
}
