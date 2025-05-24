import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TTS Playground | Coming Soon",
  description: "A modern, SEO-friendly Text-to-Speech Playground. Coming Soon!",
  keywords: ["TTS", "Text to Speech", "Playground", "AI", "Next.js"],
  openGraph: {
    title: "TTS Playground | Coming Soon",
    description: "A modern, SEO-friendly Text-to-Speech Playground. Coming Soon!",
    url: "https://tts-playground.com/",
    siteName: "TTS Playground",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TTS Playground Coming Soon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TTS Playground | Coming Soon",
    description: "A modern, SEO-friendly Text-to-Speech Playground. Coming Soon!",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://tts-playground.com/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
