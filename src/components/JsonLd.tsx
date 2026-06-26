import { UNITS, type UnitStatus } from '@/data/units';
import { siteUrl } from '@/i18n';

// Map our availability states onto schema.org ItemAvailability so search
// engines can surface accurate listing status.
const AVAILABILITY: Record<UnitStatus, string> = {
  available: 'https://schema.org/InStock',
  reserved: 'https://schema.org/LimitedAvailability',
  sold: 'https://schema.org/SoldOut',
};

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
        numberOfBedrooms: u.beds,
        floorSize: {
          '@type': 'QuantitativeValue',
          value: u.total,
          unitCode: 'MTK',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Marathounda',
          addressRegion: 'Paphos',
          addressCountry: 'CY',
        },
        // Off-plan residences are priced on application; the Offer still
        // carries availability so engines can show listing status. When a
        // numeric price is set in units.ts it is published here automatically.
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          availability: AVAILABILITY[u.status],
          ...(typeof u.price === 'number' ? { price: u.price } : { description: 'Price on application' }),
          seller: { '@type': 'RealEstateAgent', name: 'Terra Something' },
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
