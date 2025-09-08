// service-worker.js — Always Fresh (keshsiz)
self.addEventListener('install', (e) => {
  self.skipWaiting(); // darhol ishga tush
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // Barcha eski keshlarni tozalaymiz
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Har doim tarmoqdan olib kel (no-store). Oflayn bo'lsa — keshdan borini berishga urinish.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(new Request(e.request, { cache: 'no-store' }))
      .catch(() => caches.match(e.request))
  );
});
