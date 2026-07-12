import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/server/supabase";

export const metadata: Metadata = {
  title: "登入",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">// account</p>
          <h1>登入</h1>
          <p className="lead">
            新建帳戶、Email 登入，或使用 Google。會員文章需登入且訂閱有效。
          </p>
        </div>
      </header>

      <div className="tech-wrap-narrow tech-section" style={{ borderBottom: 0 }}>
        {!configured ? (
          <div className="tech-panel">
            <div className="tech-panel__body">
              <div className="out">Supabase Auth 連線檢查中／未設定</div>
              <div className="dim">
                應已寫入 .env.local。若仍見此訊息請重啟 npm run dev。
              </div>
            </div>
          </div>
        ) : (
          <>
            {sp.error && (
              <p style={{ color: "#fca5a5", marginBottom: 16 }}>
                登入失敗，請再試一次。
              </p>
            )}
            <LoginForm nextPath={sp.next || "/account"} />
          </>
        )}
        <p className="lead" style={{ marginTop: 32 }}>
          還沒訂閱？{" "}
          <Link href="/subscribe" style={{ color: "var(--t-accent-2)" }}>
            查看 23 Perspectives
          </Link>
        </p>
      </div>
    </>
  );
}
