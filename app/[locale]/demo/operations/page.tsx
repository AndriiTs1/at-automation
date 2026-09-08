import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import OperationsWorkspace from "@/components/demo/operations/OperationsWorkspace";

export default async function OperationsPage(props: PageProps<"/[locale]/demo/operations">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <OperationsWorkspace />
    </Suspense>
  );
}
