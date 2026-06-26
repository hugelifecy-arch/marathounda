import type { MetadataRoute } from 'next';
import { locales, defaultLocale, siteUrl } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
  }));
}
