import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { homepageLanguageAlternates, localePath, OG_LOCALE_MAP, SITE_URL } from "@/lib/site-config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");
  const title = t("title");
  const description = t("description");

  const ogImage = {
    url: "/at-automation-og.png",
    width: 1734,
    height: 907,
    alt: title,
  };

  const canonicalPath = localePath(locale);
  const alternateLocales = routing.locales.filter((candidate) => candidate !== locale).map((candidate) => OG_LOCALE_MAP[candidate]);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: homepageLanguageAlternates(),
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "AT Automation",
      locale: OG_LOCALE_MAP[locale] ?? "en_US",
      alternateLocale: alternateLocales,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Locks every next-intl API call in this render (including NextIntlClientProvider's
  // auto-resolution below) to the URL-derived locale, instead of the header/cookie-based
  // fallback next-intl otherwise uses — this is what keeps server and client in sync.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
