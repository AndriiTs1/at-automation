import { setRequestLocale } from "next-intl/server";
import DemoAppShell from "@/components/demo/DemoAppShell";

export default async function DemoLayout(props: LayoutProps<"/[locale]/demo">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="h-screen w-full overflow-hidden bg-neutral-50">
      <DemoAppShell>{props.children}</DemoAppShell>
    </div>
  );
}
