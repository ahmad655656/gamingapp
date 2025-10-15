import localFont from "next/font/local";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "ألعاب الذكاء",
  description: "تطبيق ألعاب الذكاء",
};

export default function RootLayout({ children }) {
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
        <ServiceWorkerRegister /> {/* ✅ تسجيل الـ Service Worker */}
      </body>
    </html>
  );
}
