// src/app/layout.js

import { Inter } from "next/font/google"; 
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

// 1. تعريف خط Google
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 2. تعريف بيانات التعريف (metadata) وإضافة رابط Manifest
export const metadata = {
  title: "ألعاب الذكاء",
  description: "تطبيق ألعاب الذكاء",
  // ✅ إضافة المسار إلى ملف manifest.json - ضروري لربط PWA
  manifest: "/manifest.json", 
};

// 3. تصدير المكون الرئيسي RootLayout
export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      // ✅ استخدام خط Inter بدلاً من الخطوط المحلية
      className={`${inter.variable} font-sans`} 
    >
      <body
        className={`
          ${inter.variable} font-sans
          antialiased
          bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e]
          min-h-screen
        `}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}