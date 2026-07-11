import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow flex flex-col items-start py-28">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">
        這頁還沒長出來。
      </h1>
      <p className="mt-4 text-muted">回首頁看看，或讀一篇 Perspectives。</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          回首頁
        </Link>
        <Link href="/perspectives" className="btn btn-ghost">
          Perspectives
        </Link>
      </div>
    </div>
  );
}
