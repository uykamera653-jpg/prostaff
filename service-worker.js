// Always-Fresh, cache-less SW
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(new Request(e.request, {cache: 'no-store'})).catch(() => caches.match(e.request))
  );
});
