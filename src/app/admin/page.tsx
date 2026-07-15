import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  contentStorageLabel,
  getCmsDriver,
  getContent,
} from "@/lib/cms/store";

export default async function AdminDashboard() {
  const content = await getContent();
  const driver = getCmsDriver();
  const published = content.articles.filter((a) => a.published).length;
  const members = content.articles.filter((a) => !a.free).length;

  return (
    <AdminShell
      title="總覽"
      subtitle="在此改前台文案與文章。儲存後重新整理前台即可看到。"
    >
      <div className="admin-grid-2">
        <div className="admin-card">
          <h2>內容狀態</h2>
          <p style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>
            {published} 篇已發布
          </p>
          <p style={{ margin: 0, color: "var(--admin-muted)", fontSize: "0.9rem" }}>
            其中 {members} 篇為會員文 · 共 {content.articles.length} 篇
          </p>
        </div>
        <div className="admin-card">
          <h2>最後更新</h2>
          <p style={{ margin: 0, fontSize: "1.05rem" }}>
            {new Date(content.updatedAt).toLocaleString("zh-TW")}
          </p>
          <p
            style={{
              margin: "0.75rem 0 0",
              color: "var(--admin-muted)",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            驅動：{driver} · 儲存：{contentStorageLabel()}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2>快速前往</h2>
        <div className="admin-actions" style={{ marginTop: 0 }}>
          <Link href="/admin/theme" className="admin-btn admin-btn-primary">
            主題色／CSS
          </Link>
          <Link href="/admin/about" className="admin-btn admin-btn-ghost">
            改 About / Mentor 文案
          </Link>
          <Link href="/admin/articles" className="admin-btn admin-btn-ghost">
            管理文章
          </Link>
          <Link href="/admin/home" className="admin-btn admin-btn-ghost">
            改首頁
          </Link>
          <Link href="/" className="admin-btn admin-btn-ghost" target="_blank">
            開前台（紙感）
          </Link>
          <Link href="/v" className="admin-btn admin-btn-ghost" target="_blank">
            風格預覽 lab
          </Link>
          <Link
            href="/v/hybrid"
            className="admin-btn admin-btn-ghost"
            target="_blank"
          >
            混血
          </Link>
          <Link
            href="/v/editorial"
            className="admin-btn admin-btn-ghost"
            target="_blank"
          >
            編輯室
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h2>架構說明（上線穩定）</h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.2rem",
            color: "var(--admin-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
          }}
        >
          <li>
            現在：
            <strong style={{ color: "var(--admin-text)" }}>
              {driver} driver
            </strong>
            —{" "}
            {driver === "supabase"
              ? "寫入 Supabase site_content（正式站可持久）"
              : "寫入 content/site.json（僅本機可寫碟）"}
          </li>
          <li>
            長期方案 A：Vercel + Supabase；
            <code>CMS_DRIVER=supabase</code> +{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code>（僅 server）
          </li>
          <li>
            密碼：環境變數 <code>ADMIN_PASSWORD</code> +{" "}
            <code>ADMIN_SECRET</code>
          </li>
          <li>前台所有文案／文章皆從同一份內容模型讀取，後台改完即同步</li>
        </ul>
      </div>
    </AdminShell>
  );
}
