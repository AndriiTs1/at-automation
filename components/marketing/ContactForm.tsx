"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS, contactFieldErrors, contactSchema, type ContactField, type ContactFieldErrors } from "@/lib/validation/contact";

type Status = "idle" | "submitting" | "success" | "error";

const CONTACT_EMAIL = "info@andrii-tsiurupa.ch";

// 16px (text-base) on every field on purpose: anything smaller makes iOS Safari zoom into the
// page on focus — the same fix the demo's search inputs needed.
const fieldClassName =
  "w-full scroll-mt-32 rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-neutral-400 transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:opacity-60 aria-invalid:border-error aria-invalid:focus:ring-error/20";

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "message"];

/**
 * Consultation request form — posts JSON to app/api/contact/route.ts. Client component only for
 * the submit lifecycle (idle → submitting → success | error); the surrounding copy lives in the
 * server-rendered ContactSection.
 *
 * Validation runs through the same Zod schema the route uses (lib/validation/contact.ts), with
 * `noValidate` so errors render under each field in the page's own language instead of as
 * browser tooltips. A field's error clears as soon as it's edited; the server's per-field errors
 * (should the two ever disagree) render the same way.
 */
export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const submitting = status === "submitting";
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const showErrors = (form: HTMLFormElement, errors: ContactFieldErrors) => {
    setFieldErrors(errors);
    const first = FIELD_ORDER.find((field) => errors[field]);
    // Next frame: after a server-side 400 the fields are still `disabled` until React re-renders.
    if (first) requestAnimationFrame(() => (form.elements.namedItem(first) as HTMLElement | null)?.focus());
  };

  const clearError = (field: ContactField) => {
    if (fieldErrors[field]) setFieldErrors((errors) => ({ ...errors, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form)), locale };

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      showErrors(form, contactFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Raw data, not parsed.data: the honeypot field must reach the server untouched.
        body: JSON.stringify(data),
      });
      if (response.status === 400) {
        const result = (await response.json().catch(() => null)) as { fieldErrors?: ContactFieldErrors } | null;
        if (result?.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setStatus("idle");
          showErrors(form, result.fieldErrors);
          return;
        }
      }
      if (!response.ok) throw new Error(`Contact request failed: ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Shared ARIA + error wiring for each validated field.
  const fieldProps = (field: ContactField) => ({
    name: field,
    disabled: submitting,
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby": fieldErrors[field] ? `contact-${field}-error` : undefined,
    onChange: () => clearError(field),
  });

  const fieldError = (field: ContactField) =>
    fieldErrors[field] ? (
      <span id={`contact-${field}-error`} className="text-sm text-error">
        {t(`errors.${fieldErrors[field]}`)}
      </span>
    ) : null;

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="text-xl font-semibold text-foreground">{t("successTitle")}</p>
        <p className="max-w-sm text-base text-neutral-600">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">{t("nameLabel")}</span>
          <input {...fieldProps("name")} type="text" required maxLength={CONTACT_LIMITS.name} autoComplete="name" className={fieldClassName} />
          {fieldError("name")}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">{t("emailLabel")}</span>
          <input {...fieldProps("email")} type="email" required maxLength={CONTACT_LIMITS.email} autoComplete="email" className={fieldClassName} />
          {fieldError("email")}
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">
          {t("companyLabel")} <span className="font-normal text-neutral-500">{t("optional")}</span>
        </span>
        <input {...fieldProps("company")} type="text" maxLength={CONTACT_LIMITS.company} autoComplete="organization" className={fieldClassName} />
        {fieldError("company")}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">{t("messageLabel")}</span>
        <textarea
          {...fieldProps("message")}
          required
          rows={4}
          maxLength={CONTACT_LIMITS.message}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClassName} resize-y`}
        />
        {fieldError("message")}
      </label>

      {/* Honeypot — hidden from people and assistive tech; bots that fill every field get dropped
          server-side (see app/api/contact/route.ts). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {t("error")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
        </p>
      )}

      <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-60 sm:w-auto"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
        <p className="text-sm text-neutral-500">{t("responseNote")}</p>
      </div>

      <p className="text-xs text-neutral-500">{t("privacyNote")}</p>
    </form>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
