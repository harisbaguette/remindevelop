import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "리마인드 보관소",
  description: "AI로 정리하는 나만의 지식 저장소",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f2f4f6] min-h-screen flex items-center justify-center`}
      >
        <div className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl sm:rounded-[32px] sm:min-h-[calc(100vh-40px)] sm:h-[calc(100vh-40px)] sm:overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
