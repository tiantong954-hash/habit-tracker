var CACHE_NAME = "habit-cache-v3";
var URLS_TO_CACHE = [
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
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // Network-first: always try server, fall back to cache
  e.respondWith(
    fetch(e.request).then(function(resp) {
      return resp;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
