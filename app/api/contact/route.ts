import { contactFieldErrors, contactSchema } from "@/lib/validation/contact";

/**
 * Contact form endpoint — receives the landing page's consultation request (see
 * components/marketing/ContactForm.tsx) and forwards it as a plain-text email via Resend's REST
 * API. No SDK dependency: a single `fetch` is all this needs.
 *
 * Env:
 *   RESEND_API_KEY      — required; provisioned by the Resend Vercel Marketplace integration.
 *   CONTACT_TO_EMAIL    — inbox that receives requests (defaults to the address in Header).
 *   CONTACT_FROM_EMAIL  — sender on a Resend-verified domain. The `onboarding@resend.dev`
 *                         fallback only delivers to the Resend account owner's own address.
 *
 * Validation is the shared Zod schema in lib/validation/contact.ts — the same rules the form
 * checks client-side. Responses:
 *   200 `{ ok: true }`
 *   400 `{ ok: false, error: "invalid", fieldErrors?: { name?: "nameTooShort", ... } }`
 *   502/503 `{ ok: false, error: "unavailable" }`
 * Field errors are message keys (Contact.form.errors.*), so nothing user-facing is localized here.
 */

function honeypot(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === "string" && value.trim() !== "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: the hidden "website" field is invisible to people, so anything in it is a bot.
  // Answer as if it succeeded so the bot gets no signal to retry differently.
  if (honeypot(body)) {
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", fieldErrors: contactFieldErrors(parsed.error) }, { status: 400 });
  }
  const payload = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — request not delivered");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || "—"}`,
    `Language: ${payload.locale.toUpperCase()}`,
    "",
    "What they want to automate:",
    payload.message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "AT Automation <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? "info@andrii-tsiurupa.ch"],
      reply_to: payload.email,
      subject: `New consultation request — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
      text,
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend rejected the request", response.status, await response.text());
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
