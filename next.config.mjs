// C:\Users\twilight\Desktop\gaming\next.config.mjs

import nextPWA from 'next-pwa';

// 1. تعريف إعدادات PWA مع الإضافات اللازمة لـ Next.js 15/App Router
const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  // ✅ ضروري للتوافق مع App Router والتأكد من ظهور sw.js في الإنتاج
  cacheStartUrl: false, 
  
  // ✅ يمنع استبعاد ملفات حاسمة للتطبيق من التخزين المؤقت لـ PWA
  buildExcludes: [
    /middleware-manifest\.json$/,
    /\_middleware\.js$/,
    /\.next\/server\/pages-manifest\.json$/,
  ],
  // ✅ تحديد اسم ملف Service Worker بشكل صريح
  sw: 'sw.js'
});

// 2. تعريف الإعدادات الأساسية لـ Next.js
const nextConfig = {
  // 🛑 تم حذف: experimental: { appDir: true } (وهو صحيح)
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
  },
  // ... إعدادات Next.js الأخرى
};

// 3. دمج إعدادات Next.js مع إعدادات PWA وتصديرها باستخدام ESM
export default withPWA(nextConfig);