import { createSerwistRoute } from '@serwist/turbopack';

// Evaluated once at build time (force-static), so this stamps each deploy.
const revision = crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'app/sw.ts',
  useNativeEsbuild: true,
  // public/ assets (incl. /data/countries-110m.json) are precached automatically;
  // only the page shell needs to be added explicitly.
  additionalPrecacheEntries: [{ url: '/', revision }],
});
