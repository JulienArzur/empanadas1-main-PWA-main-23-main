const CACHE_NAME = 'redonda-sabrosa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image-removebg-preview.png',
  '/cart-icon.png',
  // Agrega aquí otras imágenes necesarias
  // '/copiar.png',
  // '/[otras imágenes].png',
  // '/[otras imágenes].jpg',
];

// Install SW and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate SW and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch handler
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
