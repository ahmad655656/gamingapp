// next.config.mjs

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  // إزالة هذه الخاصية لأنها أصبحت غير ضرورية في Next.js 15:
  // cacheStartUrl: false, 

  buildExcludes: [
    /middleware-manifest\.json$/,
    /\_middleware\.js$/,
    /\.next\/server\/pages-manifest\.json$/,
  ],

  sw: 'sw.js',
});

const nextConfig = {
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
  },
};

export default withPWA(nextConfig);
