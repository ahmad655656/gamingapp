'use client';

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
 useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker مسجل بنجاح:", registration);
      })
      .catch((error) => {
        console.error("❌ فشل تسجيل Service Worker:", error);
      });
  }
}, []);


  return null;
}
