// next.config.mjs
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',           // وجه ملفات الـ PWA إلى مجلد public
  register: true,           // سجل الـ Service Worker
  skipWaiting: true,        // تخطي الانتظار عند التحديث
  disable: process.env.NODE_ENV === 'development', // تعطيل PWA في وضع التطوير

  // تخصيص إعدادات Service Worker
  sw: 'sw.js', // إشارة إلى ملف sw.js في مجلد public

  buildExcludes: [
    /middleware-manifest\.json$/,
    /\_middleware\.js$/,
    /\.next\/server\/pages-manifest\.json$/,
  ],

  // إعدادات Workbox الخاصة بالتخزين المحلي
  workboxOpts: {
    swDest: 'public/service-worker.js',  // موجه لـ public/
    runtimeCaching: [
      {
        // إعداد التخزين المحلي للصور
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 يومًا
          },
        },
      },
      {
        // إعداد التخزين للـ JavaScript و CSS و JSON
        urlPattern: /\/_next\/.*\.(js|css|json)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-assets',
        },
      },
    ],
  },
});

const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withPWA(nextConfig);
