const CACHE='pituspc-v3';
const FILES=['./','./index.html','./assets/css/styles.css','./assets/js/app.js','./assets/js/productos.js','./assets/images/logo-pituspc-3d.png','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
