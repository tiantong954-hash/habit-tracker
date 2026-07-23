var CACHE_NAME = "habit-cache-v1";
var URLS_TO_CACHE = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request);
    })
  );
});