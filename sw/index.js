if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw/sw.js').then(function() {
    console.log('Service Worker Registered');
  })
}