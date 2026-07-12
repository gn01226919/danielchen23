import { IBM_Plex_Mono, Outfit } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TechFooter, TechHeader } from "@/components/tech/TechChrome";
import { getContent } from "@/lib/cms/store";
import {
  techThemeCustomCss,
  techThemeToCssVars,
} from "@/lib/cms/theme-style";
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
  const theme = content.themeTech;
  const custom = techThemeCustomCss(theme);
  const styleVars = Object.fromEntries(
    techThemeToCssVars(theme)
      .split("; ")
      .filter(Boolean)
      .map((pair) => {
        const idx = pair.indexOf(": ");
        return [pair.slice(0, idx), pair.slice(idx + 2)];
      }),
  ) as CSSProperties;

  return (
    <div
      className={`tech-root ${outfit.variable} ${plexMono.variable}`}
      style={styleVars}
    >
      {custom ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `.tech-root {\n${custom}\n}`,
          }}
        />
      ) : null}
      <div className="tech-preview-banner">
        <span>
          <strong>完整科技站</strong>
          {" · "}
          標題淺灰 · 內文白 · 顏色可在{" "}
          <Link href="/admin/theme">後台 · 主題／CSS</Link> 調整
        </span>
        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/v">Style lab</Link>
          <Link href="/">紙感主站</Link>
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
