import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
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

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');var dark;if(t==='dark')dark=true;else if(t==='light')dark=false;else dark=window.matchMedia('(prefers-color-scheme: dark)').matches;d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light';}catch(e){}})();`}
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
