import Link from "next/link";

export function PaywallCTA({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`border border-line bg-paper-elevated ${compact ? "p-6" : "p-8 sm:p-10"}`}
    >
      <p className="eyebrow">23 Perspectives · 會員</p>
      <h3 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">
        完整視角，給願意長期對齊的人
      </h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
        這篇為訂閱內容。分享，不綁架；點醒，不代操。
        訂閱後可讀會員文章與決策脈絡。
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/login?next=/subscribe" className="btn btn-primary">
          登入／註冊後訂閱
        </Link>
        <Link href="/subscribe" className="btn btn-ghost">
          查看方案
        </Link>
        <Link href="/perspectives" className="btn btn-ghost">
          看免費文章
        </Link>
      </div>
    </aside>
  );
}
