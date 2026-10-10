const CACHE_NAME = "xc-passenger-counts-v7";
const CACHE_PREFIX = "xc-passenger-counts-";
const CORE = [
  "./",
  "./index.html",
  "./passenger-manifest.json",
  "./icons/passengers.svg",
  "./crosscountry-logo-white.png",
  "./passenger-counts.png",
  "./xc.css",
  "./xc-common.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response && response.ok) cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        const fallback = await cache.match("./index.html");
        if (fallback && event.request.mode === "navigate") return fallback;
        throw error;
      }
    })
  );
});
