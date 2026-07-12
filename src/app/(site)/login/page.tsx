import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/server/supabase";

export const metadata: Metadata = {
  title: "登入",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  return (
    <LoginPageInner searchParams={searchParams} />
  );
}

async function LoginPageInner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="container-narrow py-16 sm:py-24">
      <p className="eyebrow">Account</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">登入</h1>
      <p className="mt-4 text-muted">
        新建帳戶、Email 登入，或使用 Google。會員文章需登入且訂閱有效。
      </p>

      {!configured ? (
        <div className="mt-10 border border-line bg-paper-elevated p-6 text-sm text-muted">
          <p className="font-medium text-ink">Supabase Auth 尚未設定</p>
          <p className="mt-2">
            請在 <code>.env.local</code> 填入{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> 與{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，並在 Supabase 執行{" "}
            <code>supabase/schema.sql</code>。詳見{" "}
            <code>docs/SETUP-AUTH-STRIPE-EMAIL.md</code>。
          </p>
        </div>
      ) : (
        <div className="mt-10">
          {sp.error && (
            <p className="mb-4 text-sm text-[#8b4a3a]">登入失敗，請再試一次。</p>
          )}
          <LoginForm nextPath={sp.next || "/account"} />
        </div>
      )}

      <p className="mt-10 text-sm text-muted">
        還沒訂閱？{" "}
        <Link href="/subscribe" className="underline underline-offset-4">
          查看 23 Perspectives
        </Link>
      </p>
    </div>
  );
}
