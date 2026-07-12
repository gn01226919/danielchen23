import { IBM_Plex_Mono, Outfit } from "next/font/google";
import Link from "next/link";
import { TechFooter, TechHeader } from "@/components/tech/TechChrome";
import { getContent } from "@/lib/cms/store";
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
  title: {
    default: "Tech build · Daniel Chen",
    template: "%s · Tech · Daniel Chen",
  },
  robots: { index: false, follow: false },
};

export default async function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();

  return (
    <div className={`tech-root ${outfit.variable} ${plexMono.variable}`}>
      <div className="tech-preview-banner">
        <span>
          <strong>完整科技站 build</strong>
          {" · "}
          字色已調亮（編輯器風格）· 主站紙感仍在{" "}
          <Link href="/">/</Link>
        </span>
        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/v">Style lab</Link>
          <Link href="/admin">後台</Link>
        </span>
      </div>
      <TechHeader
        siteName={content.settings.siteName}
        product={content.settings.product}
      />
      <div className="tech-page">{children}</div>
      <TechFooter
        siteName={content.settings.siteName}
        footerLine={content.settings.footerLine}
        mentorTagline={content.settings.mentorTagline}
      />
    </div>
  );
}
