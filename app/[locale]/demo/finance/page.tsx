import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import FinanceWorkspace from "@/components/demo/finance/FinanceWorkspace";

export default async function FinancePage(props: PageProps<"/[locale]/demo/finance">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <FinanceWorkspace />
    </Suspense>
  );
}
