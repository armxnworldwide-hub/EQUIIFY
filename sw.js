const CACHE_NAME = 'falcon-offline-v3';
const LEGACY_CACHE_NAMES = ['falcon-offline-v2'];
const MEDIA_RE = /\/(songs|images)\//;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function matchCached(request) {
  for (const name of [CACHE_NAME, ...LEGACY_CACHE_NAMES]) {
    const cache = await caches.open(name);
    const match = await cache.match(request, { ignoreSearch: true });
    if (match) return match;
  }
  return null;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!MEDIA_RE.test(url.pathname)) return;

  event.respondWith((async () => {
    const cached = await matchCached(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  })());
});
