import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Daniel Chen · 23 Perspectives",
    template: "%s · Daniel Chen",
  },
  description:
    "視角型 Mentor。分享品牌、成長與 AI 的實戰洞見。And now, it's time to be the mentor for you. 23 Perspectives 訂閱。",
  metadataBase: new URL("https://danielchen23.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
