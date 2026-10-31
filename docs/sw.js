/* PeachFlow 3.2: offline static shell. Never cache cross-origin data / API credentials. */
const CACHE='peachflow-v3.3-shell-20261031';
const SHELL=['./','./index.html','./manifest.json','./icons/peach-192.png','./icons/peach-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('peachflow-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(request,copy));}return res}).catch(()=>caches.match(request).then(hit=>hit||caches.match('./index.html'))));return;
 }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
