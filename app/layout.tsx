import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/bitter/400.css";
import "@fontsource/bitter/400-italic.css";
import "@fontsource/bitter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import Nav from "./components/nav";
import SubpageEnter from "./components/subpage-enter";
import Providers from "./components/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Kai Chen",
  description: "Visiting UC Berkeley · Math at SUSTech · Fields Medal Honors Program",
  openGraph: {
    title: "Kai Chen",
    description: "Visiting UC Berkeley · Math at SUSTech · Fields Medal Honors Program",
    url: "https://kaichen.dev",
    siteName: "Kai Chen",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kai Chen",
    description: "Visiting UC Berkeley · Math at SUSTech",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');var dark;if(t==='dark')dark=true;else if(t==='light')dark=false;else dark=false;d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light';}catch(e){}})();`}
        </Script>
        <Providers>
          <Nav />
          <main className="flex-1 pt-16">
            <SubpageEnter>{children}</SubpageEnter>
          </main>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
