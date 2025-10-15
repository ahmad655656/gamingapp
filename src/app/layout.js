import localFont from "next/font/local";
import "./globals.css";

// 1. 💡 تأكد أن هذا الجزء صحيح ويتم تنفيذه قبل الـ render
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  // يمكن إزالة الوزن إذا كان متغيرًا بالكامل
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  // يمكن إزالة الوزن إذا كان متغيرًا بالكامل
});

export const metadata = {
  title: "ألعاب الذكاء",
  description: "تطبيق ألعاب الذكاء",
  // ... بقية metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
             // 💡 أضف هذين الكلاسين هنا:
             bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e] min-h-screen
        `} // تم نقل متغيرات الخطوط إلى وسم <html>
      >
        {children}
      </body>
    </html>
  );
}