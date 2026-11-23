const C='lxgo-s1';
const SHELL=['./','./index.html','./app.bin','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='lxgo-app').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin){e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}).catch(()=>r))));return;}
  if(u.pathname.includes('/app/')){ // decrypted app pages live only in this phone's cache
    let p=u.pathname; if(p.endsWith('/'))p+='index.html';
    e.respondWith(caches.open('lxgo-app').then(c=>c.match(p)).then(r=>r||Response.redirect(new URL('../',u).href,302)));return;}
  e.respondWith(fetch(e.request).then(n=>{if(!n.ok)return caches.match(e.request,{ignoreSearch:true}).then(r=>r||n);const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
