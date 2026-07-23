/// <reference lib="webworker" />
import { defaultCache } from '@serwist/turbopack/worker';
import { CacheFirst, Serwist } from 'serwist';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Vendored map data is immutable per revision — serve from cache first
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/data/'),
      handler: new CacheFirst({ cacheName: 'map-data' }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
