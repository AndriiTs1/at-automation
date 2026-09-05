import { setRequestLocale } from "next-intl/server";
import DemoDashboard from "@/components/dashboard/DemoDashboard";

export default async function DemoPage(props: PageProps<"/[locale]/demo">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="h-screen w-full overflow-hidden bg-neutral-50">
      <DemoDashboard />
    </div>
  );
}
