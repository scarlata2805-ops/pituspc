const CACHE_NAME = "pituspc-v1";
const FILES = ["./", "./index.html", "./css/styles.css", "./js/app.js", "./js/productos.js", "./img/logo-pituspc.jpg", "./manifest.json"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
