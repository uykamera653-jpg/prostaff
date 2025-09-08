const CACHE_NAME = "prostaff-cache-v2";
const PREFIX = "./"; // /prostaff/ ostida ekanimiz uchun nisbiy yo'l
const URLS_TO_CACHE = [
  `${PREFIX}`,
  `${PREFIX}index.html`,
  `${PREFIX}workers.html`,
  `${PREFIX}firms.html`,
  `${PREFIX}manifest.json`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
