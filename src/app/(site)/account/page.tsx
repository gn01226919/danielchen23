import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMembership } from "@/lib/server/membership";
import { isSupabaseConfigured } from "@/lib/server/supabase";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: "會員帳戶",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const sp = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="tech-wrap-narrow tech-section">
        <h1>會員帳戶</h1>
        <p className="lead">請設定 Supabase env 後重啟 dev server。</p>
      </div>
    );
  }

  const m = await getMembership();
  if (!m.authenticated) {
    redirect("/login?next=/account");
  }

  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">// account</p>
          <h1>會員帳戶</h1>
        </div>
      </header>
      <div className="tech-wrap-narrow tech-section" style={{ borderBottom: 0 }}>
        {sp.checkout === "success" && (
          <div className="tech-panel" style={{ marginBottom: 24 }}>
            <div className="tech-panel__body">
              <div className="out">checkout completed</div>
              <div className="dim">
                若狀態尚未更新，請稍候重新整理（Webhook 處理中）
              </div>
            </div>
          </div>
        )}

        <div className="tech-card">
          <div className="tech-card__idx">identity</div>
          <p style={{ color: "var(--t-dim)", margin: 0 }}>Email</p>
          <h3 style={{ marginTop: 4 }}>{m.email}</h3>
          <p style={{ color: "var(--t-dim)", marginTop: 16 }}>訂閱</p>
          <p style={{ color: "var(--t-text)", marginTop: 4 }}>
            {m.isMember
              ? `有效 · ${m.plan || "members"} · ${m.status}`
              : "尚未訂閱或已失效"}
          </p>
          {m.currentPeriodEnd && (
            <p style={{ color: "var(--t-muted)", fontSize: 14 }}>
              週期至 {new Date(m.currentPeriodEnd).toLocaleString("zh-TW")}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
          {!m.isMember && (
            <Link href="/subscribe" className="tech-btn tech-btn-primary">
              訂閱 23 Perspectives
            </Link>
          )}
          <Link href="/perspectives" className="tech-btn tech-btn-ghost">
            Perspectives
          </Link>
          <Link href="/contact" className="tech-btn tech-btn-ghost">
            寫信給我
          </Link>
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
