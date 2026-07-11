import Link from "next/link";
import type { Article } from "@/data/site";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/perspectives/${article.slug}`} className="card-paper group block overflow-hidden">
      <div
        className="aspect-[16/10] w-full"
        style={{ background: article.coverGradient }}
        aria-hidden
      />
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="tracking-wide">{article.category}</span>
          <span aria-hidden>·</span>
          <span>{article.readMinutes} 分鐘</span>
          {!article.free && (
            <>
              <span aria-hidden>·</span>
              <span className="text-accent">會員</span>
            </>
          )}
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
          {article.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
          {article.excerpt}
        </p>
        <p className="mt-5 text-sm text-ink-soft underline-offset-4 group-hover:underline">
          閱讀視角
        </p>
      </div>
    </Link>
  );
}
