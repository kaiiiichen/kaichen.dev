import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/bitter/400.css";
import "@fontsource/bitter/400-italic.css";
import "@fontsource/bitter/600.css";
import "./globals.css";
import Nav from "./components/nav";
import LeftRibbon from "./components/left-ribbon";
import RightRibbon from "./components/right-ribbon";
import NavWaveOverlay from "./components/nav-wave-overlay";
import SubpageEnter from "./components/subpage-enter";
import Providers from "./components/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kai Chen",
  description: "Personal site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');var dark;if(t==='dark')dark=true;else if(t==='light')dark=false;else dark=false;d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light';}catch(e){}})();`}
        </Script>
        <Providers>
          <LeftRibbon />
          <RightRibbon />
          <NavWaveOverlay />
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
