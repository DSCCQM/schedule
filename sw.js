const CACHE_NAME = 'dashboard-store-v1';
const urlsToCache = [
  '/',                // 快取根目錄
  '/index.html',     // 快取首頁 HTML
  '/manifest.json',   // 快取 manifest 檔案
  '/icon-192.png',   // 快取 192px 圖示
  '/icon-512.png',   // 快取 512px 圖示
];

// 「安裝」事件：開啟快取，並將基本檔案加入快取。
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] 正在快取基本檔案...');
      return cache.addAll(urlsToCache);
    })
  );
});

// 「激活」事件：清理舊快取（在需要更新 App 時很有用）。
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] 激活中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] 清理舊快取:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// 「攔截」事件：攔截網路請求，優先嘗試從快取取得內容。
// 這提供基本的離線功能。
self.addEventListener('fetch', (event) => {
  // console.log('[ServiceWorker] 攔截請求:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取中有，就傳回；否則，向網路發起請求。
      return response || fetch(event.request);
    }
  ));
});
