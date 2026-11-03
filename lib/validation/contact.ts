import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * Single source of truth for the consultation form's rules — parsed both in ContactForm.tsx
 * (before submit, to show per-field errors) and in app/api/contact/route.ts (the authoritative
 * check). Error messages are not prose but keys into the `Contact.form.errors` message catalog,
 * so the server never has to know the visitor's language and both sides render the same text.
 */

export const CONTACT_LIMITS = { name: 120, email: 200, company: 160, message: 4000 } as const;

export const contactSchema = z.object({
  name: z
    .string({ error: "nameTooShort" })
    .trim()
    .min(2, { error: "nameTooShort" })
    .max(CONTACT_LIMITS.name, { error: "tooLong" }),
  email: z
    .string({ error: "emailInvalid" })
    .trim()
    .max(CONTACT_LIMITS.email, { error: "tooLong" })
    .pipe(z.email({ error: "emailInvalid" })),
  company: z
    .string({ error: "tooLong" })
    .trim()
    .max(CONTACT_LIMITS.company, { error: "tooLong" })
    .optional()
    .default(""),
  message: z
    .string({ error: "messageTooShort" })
    .trim()
    .min(10, { error: "messageTooShort" })
    .max(CONTACT_LIMITS.message, { error: "tooLong" }),
  // Not a user-facing field: an unknown or missing locale falls back to the default instead of
  // rejecting an otherwise valid request.
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "company" | "message";
export type ContactErrorKey = "nameTooShort" | "emailInvalid" | "messageTooShort" | "tooLong";

/** Per-field error keys, at most one per field (the first failing rule). */
export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorKey>>;

const ERROR_KEYS: readonly string[] = ["nameTooShort", "emailInvalid", "messageTooShort", "tooLong"];
const FIELDS: readonly string[] = ["name", "email", "company", "message"];

export function contactFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || !FIELDS.includes(field)) continue;
    const key = ERROR_KEYS.includes(issue.message) ? issue.message : "tooLong";
    fieldErrors[field as ContactField] ??= key as ContactErrorKey;
  }
  return fieldErrors;
}
