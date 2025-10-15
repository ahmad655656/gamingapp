'use client';

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
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

  return null;
}
