self.addEventListener('install', event => {
    console.log('Service Worker instalado!');
    event.waitUntil(
      caches.open('uploader-cache-v1').then(cache => {
        return cache.addAll([
          './',
          './index.html',
          './style.css',
          './manifest.json'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });  