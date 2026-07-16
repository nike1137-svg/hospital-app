import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "병원동행 매칭 서비스",
  description:
    "우리 동네에서 믿을 만한 경력·자격의 요양보호사를 찾아 병원동행을 매칭받으세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-black/10 dark:border-white/15 py-6 text-center text-xs text-foreground/50">
          병원동행 매칭 서비스 · 과제용 프로토타입 (Phase 1)
        </footer>
      </body>
    </html>
  );
}
