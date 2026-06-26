import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ru', 'el', 'he', 'zh', 'de'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';
export const rtlLocales: Locale[] = ['he'];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
