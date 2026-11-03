import ContactForm from "@/components/marketing/ContactForm";
import ContactIntro from "@/components/marketing/ContactIntro";

/**
 * Closing consultation block — the page's conversion endpoint, placed after IntegrationEcosystem
 * and directly before the Footer. `id="contact"` (on the content grid, see --anchor-offset in
 * globals.css) is the no-JS fallback target of the Hero and Header CTAs, which otherwise open the
 * same form in ContactModal; this section stays for visitors who scroll down to it. The border-t
 * separates it from IntegrationEcosystem's white surface, since the background tokens alone are
 * too close in tone to read as two sections.
 */
export default function ContactSection() {

  return (
    <section className="border-t border-border bg-background px-6 pt-12 pb-16 md:px-8 md:pt-14 md:pb-20 lg:px-12">
      <div id="contact" className="mx-auto grid max-w-7xl scroll-mt-[var(--anchor-offset)] grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <ContactIntro variant="section" />

        <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
