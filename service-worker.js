const CACHE = 'prostaff-v1';
const ASSETS = [
  './', './index.html', './bugun.html', './ertaga.html', './firms.html',
  './style.css', './app.js', './icon-190.png', './icon-191.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      }))
    );
  }
});
