"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef } from "react";
import ContactForm from "@/components/marketing/ContactForm";
import ContactIntro from "@/components/marketing/ContactIntro";

/** Attribute that turns any link into a "open the consultation dialog" trigger. */
export const CONTACT_TRIGGER_ATTR = "data-contact-trigger";

/**
 * Consultation request dialog — the Header CTAs (desktop and mobile) open it instead of scrolling
 * to #contact. Mounted once in the marketing layout.
 *
 * Triggers are plain `<a href="#contact" data-contact-trigger>` links, picked up by one delegated
 * click listener here, so any link can become a trigger without wiring state through to it, and
 * without JS the links still scroll to the on-page ContactSection.
 *
 * Built on the native <dialog> + showModal(), which already provides role="dialog",
 * aria-modal, Escape to close, focus returned to the trigger on close, and an inert page behind
 * it so Tab stays inside. What's added here: backdrop click to close, initial focus on the first
 * field (the native default would be the close button, which comes first in the DOM), and
 * locking page scroll while it's open.
 */
export default function ContactModal() {
  const t = useTranslations("Contact.modal");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTriggerClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest(`[${CONTACT_TRIGGER_ATTR}]`);
      if (!trigger || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      if (!dialog.open) {
        dialog.showModal();
        dialog.querySelector<HTMLElement>("input, textarea, button[type=submit]")?.focus();
        document.documentElement.style.overflow = "hidden";
      }
    };
    const handleClose = () => {
      document.documentElement.style.overflow = "";
    };

    document.addEventListener("click", handleTriggerClick);
    dialog.addEventListener("close", handleClose);
    return () => {
      document.removeEventListener("click", handleTriggerClick);
      dialog.removeEventListener("close", handleClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // A click whose target is the <dialog> itself landed on the backdrop: all visible content
      // sits in the inner wrapper, which fills the dialog box edge to edge.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
    >
      {/* Close button pinned to the dialog's top edge (zero-height sticky row), so it stays
          reachable when the content is taller than a phone screen and scrolls. */}
      <div className="sticky top-0 z-10 flex h-0 justify-end">
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="mt-3 mr-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-neutral-500 backdrop-blur-sm transition-colors hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none md:mt-5 md:mr-5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" className="h-5 w-5">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="p-5 md:p-8">
        <ContactIntro variant="modal" titleId={titleId} />
        <div className="mt-6 border-t border-border pt-6">
          <ContactForm />
        </div>
      </div>
    </dialog>
  );
}
