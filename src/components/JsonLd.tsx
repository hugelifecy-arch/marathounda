import { UNITS } from '@/data/units';
import { siteUrl } from '@/i18n';

export default function JsonLd({ locale }: { locale: string }) {
  const base = `${siteUrl}/${locale}`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Terra Something',
    url: base,
    image: `${siteUrl}/renders/render-01.jpg`,
    telephone: '+357 99 854773',
    email: 'info@kalaitsidis.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marathounda',
      addressRegion: 'Paphos',
      addressCountry: 'CY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.7925,
      longitude: 32.4828,
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Rigilia Enterprises Ltd',
    },
  };

  const residences = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Terra Something Residences',
    numberOfItems: UNITS.length,
    itemListElement: UNITS.map((u, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Residence',
        name: `Residence ${u.id} — ${u.type}`,
        url: `${base}#residences`,
        image: `${siteUrl}/renders/render-${u.renderKey}.jpg`,
        numberOfRooms: u.beds,
        floorSize: {
          '@type': 'QuantitativeValue',
          value: u.total,
          unitCode: 'MTK',
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(residences) }} />
    </>
  );
}
