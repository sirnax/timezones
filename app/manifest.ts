import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Time Zones — Interactive Time Zone Map',
    short_name: 'Time Zones',
    description:
      'Explore world time zones, compare times across capital cities, and plan across time zones with an interactive map.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070b1a',
    theme_color: '#070b1a',
    orientation: 'any',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
