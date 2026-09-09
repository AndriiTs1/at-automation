import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DemoAppShell from "@/components/demo/DemoAppShell";

/**
 * The demo application is a live, publicly reachable product demo — not marketing content meant
 * to compete in search results, and every one of its ~10 routes would otherwise inherit the
 * marketing homepage's title/description/canonical from the root [locale] layout (see
 * app/[locale]/layout.tsx). `robots` is the one metadata key this layout overrides — Next.js
 * metadata merging replaces a key wholesale at the most specific segment that defines it, so this
 * doesn't disturb the inherited title/description/OG image demo pages still show in the browser
 * tab/link previews; it only keeps them out of search indexes. Access itself is untouched — this
 * is a crawler directive, not an auth gate.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function DemoLayout(props: LayoutProps<"/[locale]/demo">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="h-screen w-full overflow-hidden bg-neutral-50">
      <DemoAppShell>{props.children}</DemoAppShell>
    </div>
  );
}
