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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  if (PRECACHE_URLS.includes(url.pathname)) {
    e.respondWith(caches.match(url.pathname));
    return;
  }

  // Network-first & offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(r => {
          if (r.status < 400) caches.open(CACHE_NAME).then(c => c.put(request, r.clone()));
          return r;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  e.respondWith(fetch(request).catch(() => caches.match(request)));
});