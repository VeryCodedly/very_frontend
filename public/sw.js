const CACHE_NAME = 'verycodedly-v3'; 

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/learn',
  '/read',
  '/manifest.json',
  '/fonts/geist-mono-v3-latin-900.woff2',
  '/fonts/poppins-v23-latin-900.woff2',
  '/fonts/roboto-mono-v30-latin-regular.woff2',
  '/images/community-img.svg',
  '/images/bg-404.jpg',
  '/images/bg-1.svg',
  '/icons/icon.svg',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching offline page + assets');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const request = e.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  if (PRECACHE_URLS.includes(url.pathname)) {
    e.respondWith(caches.match(url.pathname));
    return;
  }

  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status < 400) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          console.log('Offline — serving offline.html');
          return caches.match('/offline.html');
        })
    );
    return;
  }

  e.respondWith(
    fetch(request).catch(() => caches.match(request) || caches.match('/offline.html'))
  );
});