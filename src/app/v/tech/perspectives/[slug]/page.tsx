import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms/store";
import { canReadFullArticle } from "@/lib/server/membership";

type Props = { params: Promise<{ slug: string }> };
const base = "/v/tech";

/** 與主站文章頁相同：鎖文需 cookie，整頁強制動態 */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const content = await getContent();
  return content.articles
    .filter((a) => a.published)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const article = content.articles.find((a) => a.slug === slug);
  return { title: article?.title ?? "Not found" };
}

export default async function TechArticlePage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const article = content.articles.find((a) => a.slug === slug && a.published);
  if (!article) notFound();

  const allowed = await canReadFullArticle(article.free);
  const locked = !allowed;
  const visible = locked ? article.body.slice(0, 2) : article.body;

  return (
    <article>
      <div
        className="tech-cover"
        style={{ background: article.coverGradient }}
      />
      <header className="tech-page-header">
        <div className="tech-wrap-read">
          <div className="tech-article-meta">
            <span>{article.category}</span>
            <span>·</span>
            <time dateTime={article.date}>{article.date}</time>
            <span>·</span>
            <span>{article.readMinutes} min</span>
            {locked && (
              <>
                <span>·</span>
                <span style={{ color: "var(--t-accent)" }}>members</span>
              </>
            )}
          </div>
          <h1>{article.title}</h1>
          <p className="lead">{article.excerpt}</p>
        </div>
      </header>

      <div className="tech-wrap-read tech-section" style={{ borderBottom: 0 }}>
        <div className={locked ? "tech-lock" : undefined}>
          <div className="tech-prose">
            {visible.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
        </div>

        {locked && (
          <div className="tech-paywall">
            <p className="tech-kicker" style={{ marginBottom: 0 }}>
              members only
            </p>
            <h3>完整視角，給願意長期對齊的人</h3>
            <p>
              這篇為訂閱內容。訂閱 23 Perspectives
              後可讀全文與決策脈絡。
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.65rem",
                marginTop: "1.15rem",
              }}
            >
              <Link
                href="/login?next=/subscribe"
                className="tech-btn tech-btn-primary"
              >
                登入後訂閱
              </Link>
              <Link href="/subscribe" className="tech-btn tech-btn-ghost">
                方案
              </Link>
              <Link
                href={`${base}/perspectives`}
                className="tech-btn tech-btn-ghost"
              >
                看免費文章
              </Link>
            </div>
          </div>
        )}

        {!locked && (
          <aside className="tech-cta" style={{ marginTop: "2.5rem" }}>
            <div>
              <h3>若這篇視角對你有用</h3>
              <p>訂閱，收到下一則視角。路，還是你自己走。</p>
              <p className="tech-quote" style={{ marginTop: "0.75rem" }}>
                {content.settings.mentorEnglish}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <Link
                href={`${base}/subscribe`}
                className="tech-btn tech-btn-primary"
              >
                訂閱
              </Link>
              <Link
                href={`${base}/perspectives`}
                className="tech-btn tech-btn-ghost"
              >
                再讀一篇
              </Link>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
