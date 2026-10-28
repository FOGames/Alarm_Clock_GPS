const CACHE_NAME = 'wakeway-shell-v1';
const APP_SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.webmanifest', '/assets/icon.svg'];
const RUNTIME_HOSTS = new Set(['unpkg.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com', 'fonts.gstatic.com']);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isRuntimeAsset = RUNTIME_HOSTS.has(url.hostname);
  if (url.origin !== self.location.origin && !isRuntimeAsset) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response;
  }).catch(() => (isRuntimeAsset ? Response.error() : caches.match('/index.html')))));
});
