"use client";

import Script from "next/script";

interface Props {
  gaId?: string;
  tawkPropertyId?: string;
  tawkWidgetId?: string;
}

export default function Analytics({ gaId, tawkPropertyId, tawkWidgetId }: Props) {
  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && gaId.startsWith("G-") && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Tawk.to Chat en vivo */}
      {tawkPropertyId && tawkWidgetId && (
        <Script id="tawkto" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      )}
    </>
  );
}
