import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "陈京岳 | GTM 全链路增长与品牌市场候选人",
  description:
    "陈京岳 / Jingyue Chen 的个人求职展示网页，聚焦 GTM 全链路、市场与用户洞察、经营目标拆解、渠道与异业增长、跨部门上线协同及数据与 AI 提效。",
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
