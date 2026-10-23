/* Passenger Count PWA — unique cache namespace; preserve local data on updates. */
const CACHE_NAME = 'xc-passenger-count-pwa-shell-v6';
const SHELL = ['./','./index.html','./manifest.webmanifest','./icon.svg','./voyager-header.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('xc-passenger-count-pwa-shell-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(event.request);
    try{
      const response=await fetch(event.request);
      if(response&&response.ok&&event.request.url.startsWith(self.location.origin)) cache.put(event.request,response.clone());
      return response;
    }catch(err){
      return cached || await cache.match('./index.html') || Response.error();
    }
  })());
});