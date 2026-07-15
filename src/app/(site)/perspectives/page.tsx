import Link from "next/link";
import { getContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Perspectives",
  description:
    "品牌、成長、AI 與現場決策。每篇都是一個視角——Daniel Chen · 23 Perspectives。",
  path: "/perspectives",
});

export default async function PerspectivesPage() {
  const content = await getContent();
  const articles = content.articles.filter((a) => a.published);
  
  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap">
          <p className="tech-kicker">// writing</p>
          <h1>{content.perspectives.title}</h1>
          <p className="lead">{content.perspectives.lead}</p>
        </div>
      </header>

      <div className="tech-wrap tech-section" style={{ borderBottom: 0 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem",
            marginBottom: "1.5rem",
          }}
        >
          {["全部", "成長", "品牌", "AI", "現場"].map((tag, i) => (
            <span
              key={tag}
              className={i === 0 ? "tech-chip tech-chip-accent" : "tech-chip"}
            >
              {tag}
            </span>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="lead">尚無文章。</p>
        ) : (
          <div className="tech-bento tech-bento-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/perspectives/${article.slug}`}
                className="tech-card"
              >
                <div className="tech-card__idx">{article.date}</div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="tech-card-meta">
                  <span className="tech-chip">{article.category}</span>
                  <span
                    className={
                      article.free ? "tech-chip" : "tech-chip tech-chip-accent"
                    }
                  >
                    {article.free ? "free" : "members"}
                  </span>
                  <span className="tech-chip">{article.readMinutes} min</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
