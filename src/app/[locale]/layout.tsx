import { Fraunces, Outfit } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, rtlLocales, defaultLocale, siteUrl, type Locale } from '@/i18n';
import { CurrencyProvider } from '@/components/CurrencyProvider';
import type { Metadata } from 'next';
import '../globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const titles: Record<string, string> = {
    en: 'Terra Something — Affordable Homes Paphos | New Build Marathounda',
    ru: 'Terra Something — Купить дом Пафос | Таунхаус Кипр',
    el: 'Terra Something — Φθηνά σπίτια Πάφος | Κατοικίες Μαραθούντα',
    he: 'Terra Something — נכס בקפריסין פאפוס',
    zh: 'Terra Something — 塞浦路斯帕福斯房产',
    de: 'Terra Something — Immobilien Paphos kaufen | Zypern Neubau',
  };
  const descriptions: Record<string, string> = {
    en: '12 contemporary maisonettes in Marathounda village, Paphos, Cyprus. 5% VAT eligible. Sunset sea views. Pre-sale open September 2026.',
    ru: '12 современных таунхаусов в деревне Маратунда, Пафос, Кипр. НДС 5%. Вид на море. Предпродажа открыта.',
    el: '12 σύγχρονες μεζονέτες στο χωριό Μαραθούντα, Πάφος, Κύπρος. ΦΠΑ 5%.',
    he: '12 דירות מודרניות בכפר מאראתונדה, פאפוס, קפריסין. מע"מ 5%.',
    zh: '12套现代复式住宅，位于塞浦路斯帕福斯马拉松达村。5%增值税优惠。',
    de: '12 moderne Maisonettes im Dorf Marathounda, Paphos, Zypern. 5% MwSt.',
  };
  const locale = params.locale;
  const title = titles[locale] ?? titles.en;
  const description = descriptions[locale] ?? descriptions.en;
  const ogImage = { url: '/renders/render-01.jpg', width: 1920, height: 1080, alt: 'Terra Something — Marathounda, Paphos' };
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: 'Terra Something',
      title,
      description,
      locale,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        'x-default': `/${defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) notFound();
  setRequestLocale(params.locale);
  const messages = await getMessages();
  const isRTL = rtlLocales.includes(params.locale as Locale);

  return (
    <html lang={params.locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="bg-limestone font-outfit text-ink">
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
