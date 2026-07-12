import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaywallCTA } from "@/components/PaywallCTA";
import { getContent } from "@/lib/cms/store";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getContent();
  return content.articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const article = content.articles.find((a) => a.slug === slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const article = content.articles.find((a) => a.slug === slug && a.published);
  if (!article) notFound();

  const locked = !article.free;
  const visibleBody = locked ? article.body.slice(0, 2) : article.body;

  return (
    <article className="pb-24">
      <header className="border-b border-line">
        <div
          className="min-h-[36vh] w-full"
          style={{ background: article.coverGradient }}
          aria-hidden
        />
        <div className="container-reading py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>{article.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{article.date}</time>
            <span aria-hidden>·</span>
            <span>{article.readMinutes} 分鐘</span>
            {locked && (
              <>
                <span aria-hidden>·</span>
                <span className="text-accent">會員文章</span>
              </>
            )}
          </div>
          <h1 className="mt-5 font-serif text-[clamp(1.85rem,4vw,2.75rem)] text-ink">
            {article.title}
          </h1>
          <p className="mt-6 text-lg text-muted">{article.excerpt}</p>
        </div>
      </header>

      <div className="container-reading py-12 sm:py-16">
        <div className={locked ? "lock-fade" : undefined}>
          <div className="prose-dc">
            {visibleBody.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>

        {locked && (
          <div className="relative z-10 mt-2">
            <PaywallCTA />
          </div>
        )}

        {!locked && (
          <aside className="mt-16 border-t border-line pt-12">
            <h2 className="font-serif text-2xl text-ink">
              若這篇視角對你有用
            </h2>
            <p className="mt-4 text-muted">
              23 Perspectives 是我持續分享思想的地方。訂閱，收到下一則視角；路，還是你自己走。
            </p>
            <p className="mt-3 font-serif text-lg italic text-ink-soft">
              {content.settings.mentorEnglish}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/subscribe" className="btn btn-primary">
                訂閱 23 Perspectives
              </Link>
              <Link href="/perspectives" className="btn btn-ghost">
                再讀一篇
              </Link>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
