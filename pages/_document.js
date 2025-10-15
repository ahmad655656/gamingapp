import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* رابط manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* أيقونات التطبيق */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#00ffff" />
        <meta name="description" content="تطبيق ألعاب الذكاء من Haedara" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
