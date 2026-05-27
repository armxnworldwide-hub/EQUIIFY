const FALCON_CACHE = 'falconx-shell-v3';
const RUNTIME_CACHE = 'falconx-runtime-v3';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './images/falcon.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(FALCON_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key !== FALCON_CACHE && key !== RUNTIME_CACHE) return caches.delete(key);
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin && (url.pathname.endsWith('.mp3') || url.pathname.includes('/songs/'))) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isSameOrigin && (url.pathname.endsWith('.html') || request.mode === 'navigate')) {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirst(request, fallbackPath) {
  const runtime = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(request);
    runtime.put(request, fresh.clone());
    return fresh;
  } catch (error) {
    const cached = await runtime.match(request);
    if (cached) return cached;

    const shell = await caches.open(FALCON_CACHE);
    if (fallbackPath) {
      const fallback = await shell.match(fallbackPath);
      if (fallback) return fallback;
    }

    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  const cached = await runtime.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) runtime.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) return networkResponse;

  const shell = await caches.open(FALCON_CACHE);
  return shell.match(request);
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'falconx-background-sync') {
    event.waitUntil(Promise.resolve());
  }
});
