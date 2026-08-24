import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "陈京岳 | GTM & Integrated Marketing Profile",
  description:
    "陈京岳 / Jingyue Chen 的个人求职展示网页，聚焦 GTM、整合营销策略、品牌增长与数据驱动运营。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
