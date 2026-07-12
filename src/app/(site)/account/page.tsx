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
      <div className="container-narrow py-20">
        <h1 className="font-serif text-3xl">會員帳戶</h1>
        <p className="mt-4 text-muted">
          請先設定 Supabase（見 docs/SETUP-AUTH-STRIPE-EMAIL.md）。
        </p>
      </div>
    );
  }

  const m = await getMembership();
  if (!m.authenticated) {
    redirect("/login?next=/account");
  }

  return (
    <div className="container-narrow py-16 sm:py-24">
      <p className="eyebrow">Account</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">會員帳戶</h1>

      {sp.checkout === "success" && (
        <p className="mt-6 border border-line bg-paper-elevated p-4 text-sm text-muted">
          結帳流程已完成。若訂閱狀態尚未更新，請稍候幾秒後重新整理（Webhook
          處理中）。
        </p>
      )}

      <div className="mt-10 space-y-4 border border-line bg-paper-elevated p-6">
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Email</p>
          <p className="mt-1">{m.email}</p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">訂閱</p>
          <p className="mt-1">
            {m.isMember
              ? `有效 · ${m.plan || "members"} · ${m.status}`
              : "尚未訂閱或已失效"}
          </p>
          {m.currentPeriodEnd && (
            <p className="mt-1 text-sm text-muted">
              週期至 {new Date(m.currentPeriodEnd).toLocaleString("zh-TW")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {!m.isMember && (
          <Link href="/subscribe" className="btn btn-primary">
            訂閱 23 Perspectives
          </Link>
        )}
        <Link href="/perspectives" className="btn btn-ghost">
          讀 Perspectives
        </Link>
        <Link href="/contact" className="btn btn-ghost">
          給我寫信
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
