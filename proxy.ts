import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// next-intl's default locale resolution order is: URL prefix > locale cookie >
// Accept-Language header > defaultLocale. That last two together mean a
// brand-new visitor (no cookie yet) gets whatever locale their browser
// prefers instead of the site's default (English). We only want to drop the
// Accept-Language step: once a visitor has picked a locale (via the switcher,
// or by opening a prefixed URL like /ru), next-intl sets its "NEXT_LOCALE"
// cookie automatically, and that cookie continues to be honored below —
// returning visitors are never forced back to English.
export default function proxy(request: NextRequest) {
  if (!request.cookies.has("NEXT_LOCALE")) {
    const headers = new Headers(request.headers);
    headers.delete("accept-language");
    request = new NextRequest(request, { headers });
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
