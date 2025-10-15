// src/app/layout.js

// 🛑 تم حذف: import localFont from "next/font/local";
import { Inter } from "next/font/google"; // ✅ استبدال بخط Google (Inter كمثال)
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

// 1. تعريف خط Google
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 🛑 تم حذف: تعريف geistMono و geistSans

export const metadata = {
  title: "ألعاب الذكاء",
  description: "تطبيق ألعاب الذكاء",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      // 🛑 تم تعديل: استخدام خط Inter بدلاً من geistSans و geistMono
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