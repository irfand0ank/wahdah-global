import type { Metadata } from "next";
import {
  DonateTab,
  FloatingContact,
  Footer,
  Header,
} from "@/components/site-chrome";
import { dirOf, getDict, locales, toLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { fontClasses } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = toLang((await params).lang);
  return {
    title: { default: site.name, template: `%s · ${site.name}` },
    description: getDict(lang).description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const lang = toLang((await params).lang);
  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${fontClasses} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
        <DonateTab lang={lang} />
        <FloatingContact lang={lang} />
      </body>
    </html>
  );
}
