import { IBM_Plex_Mono, Outfit } from "next/font/google";
import Link from "next/link";
import "./tech.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-tech-sans",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-tech-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Tech preview · Daniel Chen",
  robots: { index: false, follow: false },
};

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`tech-root ${outfit.variable} ${plexMono.variable}`}>
      <div className="tech-preview-banner">
        <span>
          <strong>預覽 A · 科技感模板</strong>
          {" · "}
          主站紙感仍在首頁，此頁僅供風格對照
        </span>
        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/">← 回紙感主站</Link>
          <Link href="/admin">後台</Link>
        </span>
      </div>
      {children}
    </div>
  );
}
