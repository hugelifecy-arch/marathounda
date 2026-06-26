import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ru', 'el', 'he', 'zh', 'de'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';
export const rtlLocales: Locale[] = ['he'];
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terrasomething.com';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
