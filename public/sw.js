const CACHE_NAME = 'verycodedly-shell-v1';

const PRECACHE_URLS = [
  '/offline.html',
  '/favicon.ico',
  '/images/mascot.svg',
];

// ---------- INSTALL ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ---------- FETCH ----------
self.addEventListener('fetch', (event) => {
  // Only page navigations
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      // Try to serve the last cached page
      const cache = await caches.open(CACHE_NAME);
      const cachedPage = await cache.match(event.request);

      // If one, show it
      if (cachedPage) return cachedPage;

      // Otherwise, show offline page
      return cache.match('/offline.html');
    })
  );
});
