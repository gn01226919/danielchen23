import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getContent } from "@/lib/cms/store";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.perspectives.title,
    description: c.perspectives.lead,
  };
}

export default async function PerspectivesPage() {
  const content = await getContent();
  const articles = content.articles.filter((a) => a.published);

  return (
    <div className="pb-24">
      <header className="border-b border-line py-16 sm:py-20">
        <div className="container-page">
          <p className="eyebrow">Writing</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            {content.perspectives.title}
          </h1>
          <p className="mt-5 max-w-xl text-muted">{content.perspectives.lead}</p>
        </div>
      </header>

      <div className="container-page mt-12">
        <div className="mb-10 flex flex-wrap gap-2 text-sm">
          {["全部", "成長", "品牌", "AI", "現場"].map((tag) => (
            <span
              key={tag}
              className={`border px-3 py-1.5 ${
                tag === "全部"
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-muted"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="text-muted">第一篇視角準備中。先訂閱，發布時會通知你。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
