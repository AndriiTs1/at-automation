import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/marketing/ContactForm";

/**
 * Closing consultation block — the page's conversion endpoint, placed after IntegrationEcosystem
 * and directly before the Footer. `id="contact"` (on the content grid, see --anchor-offset in
 * globals.css) is the target of the Hero's primary CTA and the Header CTA. The border-t
 * separates it from IntegrationEcosystem's white surface, since the background tokens alone are
 * too close in tone to read as two sections.
 */
export default async function ContactSection() {
  const t = await getTranslations("Contact");
  const points = t.raw("points") as string[];

  return (
    <section className="border-t border-border bg-background px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-20 lg:px-12">
      <div id="contact" className="mx-auto grid max-w-7xl scroll-mt-[var(--anchor-offset)] grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("headline")}</h2>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">{t("body")}</p>
          <ul className="mt-6 flex flex-col items-center gap-2 sm:items-start">
            {points.map((point) => (
              <li key={point} className="flex items-baseline gap-2 text-base text-neutral-600">
                <span aria-hidden="true" className="text-accent">
                  ·
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
