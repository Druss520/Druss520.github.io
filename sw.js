var cacheName = 'vd-0-1-0';
var apiCacheName = 'api-1-1-1';
var cacheFiles = [
    './',
    './index.html',
    './dist/css/main.css',
    './dist/index.js',
    './dist/manifest.json',
    './dist/img/loading.gif',
    './dist/manifest.json'
];


// 监听install事件，安装完成后，进行文件缓存
self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install');
  var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheFiles);
  });
  e.waitUntil(cacheOpenPromise);
});

self.addEventListener('fetch', function(e) {
  // 如果有cache则直接返回，否则通过fetch请求

  var cacheRequestUrls = [
    'https://api.opendota.com/api/players/'
  ]

  console.log('正在请求:' + e.request.url);

  var needCache = cacheRequestUrls.some(function(url) {
    return e.request.url.indexOf(url) > -1; 
  })

  if (needCache) {
      // 需要缓存
      // 使用fetch请求数据，并将请求结果clone一份缓存到cache
      // 此部分缓存后在browser中使用全局变量caches获取
      caches.open(apiCacheName).then(function (cache) {
          return fetch(e.request).then(function (response) {
              cache.put(e.request.url, response.clone());
              return response;
          });
      });
  }
  else {
      // 非api请求，直接查询cache
      // 如果有cache则直接返回，否则通过fetch请求
      e.respondWith(
          caches.match(e.request).then(function (cache) {
              return cache || fetch(e.request);
          }).catch(function (err) {
              console.log(err);
              return fetch(e.request);
          })
      );
  }

})

// 监听activate事件，激活后通过cache的key来判断是否更新cache中的静态资源
self.addEventListener('activate', function (e) {
  console.log('Service Worker 状态： activate');
  var cachePromise = caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
          if (key !== cacheName && key !== apiCacheName) {
              return caches.delete(key);
          }
      }));
  })
  e.waitUntil(cachePromise);
  // 注意不能忽略这行代码，否则第一次加载会导致fetch事件不触发
  return self.clients.claim();
});