import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./hybrid.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-hy-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Hybrid preview · Daniel Chen",
  robots: { index: false, follow: false },
};

export default function HybridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hy-root ${mono.variable}`}>
      <div className="hy-banner">
        <span>
          <strong>預覽 B · 混血</strong>
          {" · "}
          紙感底 + 科技節奏（mono 標籤／面板／bento）
        </span>
        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/v">全部預覽</Link>
          <Link href="/">紙感主站</Link>
          <Link href="/v/tech">科技版</Link>
        </span>
      </div>
      {children}
    </div>
  );
}
