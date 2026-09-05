import { setRequestLocale } from "next-intl/server";
import CustomersDesktop from "@/components/demo/customers/CustomersDesktop";

export default async function CustomersPage(props: PageProps<"/[locale]/demo/customers">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CustomersDesktop />;
}
