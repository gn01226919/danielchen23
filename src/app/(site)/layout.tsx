import type { CSSProperties } from "react";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { TechFooter, TechHeader } from "@/components/tech/TechChrome";
import { getContent } from "@/lib/cms/store";
import {
  techThemeCustomCss,
  techThemeToCssVars,
} from "@/lib/cms/theme-style";
import "@/app/v/tech/tech.css";

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

export default async function SiteLayout({
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
