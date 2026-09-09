import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import TeamWorkspace from "@/components/demo/team/TeamWorkspace";

export default async function TeamPage(props: PageProps<"/[locale]/demo/team">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <TeamWorkspace />
    </Suspense>
  );
}
