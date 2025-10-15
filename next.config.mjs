// C:\Users\twilight\Desktop\gaming\next.config.mjs

import nextPWA from 'next-pwa';

// 1. تعريف إعدادات PWA
const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// 2. تعريف الإعدادات الأساسية لـ Next.js
const nextConfig = {
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
  },
  // ... إعدادات Next.js الأخرى
};

// 3. دمج إعدادات Next.js مع إعدادات PWA وتصديرها باستخدام ESM
export default withPWA(nextConfig);