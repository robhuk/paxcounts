/* XC Passenger Count PWA — app-scoped offline cache */
const CACHE_NAME = "xc-passenger-counts-five-column-v3";
const CACHE_PREFIX = "xc-passenger-counts-";
const CORE = [
  "./index.html",
  "./passenger-manifest.json",
  "./icons/passengers.svg",
  "./icons/passengers-192.png",
  "./icons/passengers-512.png",
  "./crosscountry-logo-white.png",
  "./passenger-counts.png",
  "./xc.css",
  "./xc-common.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache each required asset explicitly; any missing file fails install clearly
    // rather than leaving a partially offline-capable app.
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Only handle requests inside this app's directory/scope.
  const appPath = new URL("./", self.registration.scope).pathname;
  if (!url.pathname.startsWith(appPath)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, {ignoreSearch: true});
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      if (event.request.mode === "navigate") {
        const fallback = await cache.match("./index.html");
        if (fallback) return fallback;
      }
      return new Response("This resource is not available offline.", {
        status: 503,
        statusText: "Offline",
        headers: {"Content-Type": "text/plain; charset=utf-8"}
      });
    }
  })());
});
