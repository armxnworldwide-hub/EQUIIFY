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
