const CACHE_NAME = 'verycodedly-v2';

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/learn',
  '/read',
  '/manifest.json',
  // Fonts
  '/fonts/geist-mono-v3-latin-900.woff2',
  '/fonts/poppins-v23-latin-900.woff2',
  '/fonts/roboto-mono-v30-latin-regular.woff2',
  // Images
  '/images/community-img.svg',
  '/images/bg-404.jpg',
  '/images/bg-1.svg',
  '/icons/icon.svg',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).catch((err) => {
      console.error('SW precache failed:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and API
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // Cache-first for precached assets (fonts, images, manifest)
  if (PRECACHE_URLS.some(path => url.pathname.endsWith(path.split('/').pop()!))) {
    e.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((resp) => {
          if (resp.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, resp.clone()));
          }
          return resp;
        });
      })
    );
    return;
  }

  // Network-first with fallback (HTML pages)
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status < 400) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/offline.html')) // ← offline fallback
    );
    return;
  }

  // Everything else: network-first
  e.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});