if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function() {
    console.log('Service Worker Registered');
  })
}

if ('standalone' in window.navigator && window.navigator.standalone) {
  // standalone模式进行特殊处理，例如展示返回按钮
  backBtn.show();

  backBtn.addEventListener('click', function () {
    window.history.back();
  });
}