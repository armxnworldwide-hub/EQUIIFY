const CACHE_NAME = 'falcon-pwa-v21';
const LEGACY_CACHE_NAMES = ['falcon-offline-v3', 'falcon-offline-v2'];
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './sw.js', './images/falcon.jpeg'];
const MEDIA_RE = /\/(songs|images)\//;

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(APP_SHELL.map((entry) => cache.add(new Request(entry, { cache: 'reload' })).catch(() => {})));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim())
  );
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

async function rangeResponse(request, response) {
  const range = request.headers.get('range');
  if (!range || !response) return response;

  const blob = await response.blob();
  const size = blob.size;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
  if (!match) return response;

  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isFinite(start) || start < 0) start = 0;
  if (!Number.isFinite(end) || end >= size) end = size - 1;
  if (start > end || start >= size) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${size}`
      }
    });
  }

  const body = blob.slice(start, end + 1, response.headers.get('Content-Type') || 'audio/mpeg');
  return new Response(body, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg'
    }
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', networkResponse.clone()).catch(() => {});
        return networkResponse;
      } catch (error) {
        const cached = await caches.match('./index.html');
        return cached || caches.match('./');
      }
    })());
    return;
  }

  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'manifest' || request.destination === 'image' || request.destination === 'font') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone()).catch(() => {});
        return networkResponse;
      } catch (error) {
        return cache.match('./index.html');
      }
    })());
    return;
  }

  if (!MEDIA_RE.test(url.pathname)) return;

  event.respondWith((async () => {
    const cached = await matchCached(request);
    if (cached) return rangeResponse(request, cached);

    const response = await fetch(request);
    if (response && response.ok && response.status === 200 && !request.headers.has('range')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  })());
});
