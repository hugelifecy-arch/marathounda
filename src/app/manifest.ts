import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Terra Something — Marathounda, Paphos',
    short_name: 'Terra Something',
    description:
      '12 contemporary maisonettes in Marathounda village, Paphos, Cyprus. 5% VAT eligible. Sunset sea views.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F1EA',
    theme_color: '#B5764D',
    icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
  };
}
