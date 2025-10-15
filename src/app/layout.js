'use client';

import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";

// ✅ تحميل الخطوط
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// ✅ بيانات الميتا
export const metadata = {
  title: "ألعاب الذكاء",
  description: "تطبيق ألعاب الذكاء",
};

// ✅ دالة RootLayout
export default function RootLayout({ children }) {
  // 🔹 تسجيل Service Worker عند تحميل الصفحة
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker مسجل بنجاح:", registration);
          })
          .catch((error) => {
            console.log("❌ فشل تسجيل Service Worker:", error);
          });
      });
    }
  }, []);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e]
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}
