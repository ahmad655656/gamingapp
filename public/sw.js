// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.2/workbox-sw.js');

if (workbox) {
  console.log("✅ Workbox loaded successfully!");

  // تفعيل التحديث التلقائي للـ SW
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precache الملفات الأساسية لتعمل Offline
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/icons/icon-192x192.png', revision: '1' },
    { url: '/icons/icon-512x512-1.png', revision: '1' },
    { url: '/icons/maskable_icon.png', revision: '1' },
    { url: '/_next/static/css/8149e8d6670c2396.css', revision: '8149e8d6670c2396' },
    { url: '/_next/static/chunks/main-808013ba04db7d5c.js', revision: 'Bh1JGQIxR9a_Cr_qHgk15' },
    { url: '/_next/static/chunks/main-app-2c280150b24a9fcb.js', revision: 'Bh1JGQIxR9a_Cr_qHgk15' },
    { url: '/_next/static/chunks/framework-b5bbc7099029f362.js', revision: 'Bh1JGQIxR9a_Cr_qHgk15' },
    { url: '/_next/static/chunks/pages/_app-6a626577ffa902a4.js', revision: 'Bh1JGQIxR9a_Cr_qHgk15' },
    // أضف أي صفحات أخرى تحتاجها Offline هنا
    { url: '/asset/11.webp', revision: '1' },
    { url: '/asset/22.webp', revision: '1' },
    { url: '/asset/33.webp', revision: '1' },
    { url: '/asset/44.webp', revision: '1' },
    { url: '/asset/55.webp', revision: '1' },
    { url: '/asset/66.webp', revision: '1' },
    { url: '/asset/77.webp', revision: '1' },
    { url: '/asset/88.webp', revision: '1' },
    { url: '/asset/99.webp', revision: '1' }
  ], {
    // تجاهل أي باراميتر URL عند المقارنة
    ignoreURLParametersMatching: [/.*/]
  });

  // CacheFirst للصفحات الأساسية (لتعمل Offline)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 يوم
        })
      ]
    })
  );

  // CacheFirst للصور
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 24 * 60 * 60 // 60 يوم
        })
      ]
    })
  );

  // CacheFirst للـ fonts
  workbox.routing.registerRoute(
    /\.(?:woff|woff2|ttf|otf|eot)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'fonts-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60 // سنة كاملة
        })
      ]
    })
  );

  // StaleWhileRevalidate للـ CSS و JS الأخرى
  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources'
    })
  );

  console.log("✅ Service Worker setup complete!");
} else {
  console.log("❌ Workbox failed to load");
}
