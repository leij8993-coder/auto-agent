import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Auto Agent - 二手车智能平台",
  description: "基于AI Agent的二手车行业智能助手平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-full flex" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-auto relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
