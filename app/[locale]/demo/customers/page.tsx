import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import CustomersWorkspace from "@/components/demo/customers/CustomersWorkspace";

export default async function CustomersPage(props: PageProps<"/[locale]/demo/customers">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <CustomersWorkspace />
    </Suspense>
  );
}
