import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Locale resolution is fully handled by next-intl's own middleware now that
// `routing.localeDetection` is `false` (see i18n/routing.ts): unprefixed
// paths always resolve to the default locale (English) from the URL alone,
// so the manual Accept-Language/cookie handling this file used to do is no
// longer needed.
//
// This still wraps `handleI18nRouting` in a plain function rather than doing
// `export default createMiddleware(routing)` directly — that shape was
// empirically found (via isolated A/B testing of a local `next start`
// production build) to break how the client-side router follows a
// middleware redirect during a soft navigation, e.g. the language
// switcher's `router.replace` from a non-default locale back to English
// would get stuck showing "/en" instead of landing on "/". Hard/fresh
// navigations were unaffected either way; only this export shape avoids the
// regression, so it's kept even though the function body is now a plain
// passthrough.
export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
