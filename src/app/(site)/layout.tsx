import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getContent } from "@/lib/cms/store";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();

  return (
    <div className="flex min-h-full flex-col bg-paper text-ink">
      <Header
        siteName={content.settings.siteName}
        mentorTagline={content.settings.mentorTagline}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={content.settings.siteName}
        domain={content.settings.domain}
        footerLine={content.settings.footerLine}
        mentorTagline={content.settings.mentorTagline}
      />
    </div>
  );
}
