import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Chiron_GoRound_TC } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import Providers from "./components/providers";
import SpotifyBarWrapper from "./components/spotify-bar-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

const chironGoRoundTC = Chiron_GoRound_TC({
  variable: "--font-zcool",
  subsets: ["chinese-traditional"],
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${chironGoRoundTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Nav />
          <main className="flex-1 pb-16">{children}</main>
          <SpotifyBarWrapper />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
