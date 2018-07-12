var cacheName = 'vd-0-1-0';
var apiCacheName = 'api-0-1-1';
var cacheFiles = [
    '../',
    '../dist/css/main.css',
    '../dist/index.js',
    '../dist/manifest.json',
    '../dist/img/loading.gif',
];


self.addEventListener('install', function(e) {
  console.log('State: Install');
  var cacheOpenPromise = caches.open(cacheName).then(function(cache) {
    return cache.addAll(cacheFiles);
  })
  e.waitUntil(cacheOpenPromise);
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cache) {
      return cache || fetch(e.request);
    }).catch(function(err) {
      console.log(err);
      return fetch(e.request);
    })
  )
})

self.addEventListener('activate',function(e) {
  console.log('State: activate');
  var cachePromise = caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    }))
  })
  e.waitUntil(cachePromise);
  return self.clients.claim();
})