import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";

export default async function AdminArticlesPage() {
  const content = await getContent();

  return (
    <AdminShell
      title="文章 Perspectives"
      subtitle="新增、編輯、下架。會員文會觸發付費牆。"
    >
      <div className="admin-actions" style={{ marginBottom: "1.25rem" }}>
        <Link href="/admin/articles/new" className="admin-btn admin-btn-primary">
          新增文章
        </Link>
      </div>
      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>標題</th>
              <th>分類</th>
              <th>狀態</th>
              <th>存取</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {content.articles.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
                    /{a.slug}
                  </div>
                </td>
                <td>{a.category}</td>
                <td>
                  <span
                    className={`admin-badge ${a.published ? "admin-badge-on" : ""}`}
                  >
                    {a.published ? "已發布" : "草稿"}
                  </span>
                  {a.featured && (
                    <span className="admin-badge" style={{ marginLeft: 6 }}>
                      精選
                    </span>
                  )}
                </td>
                <td>{a.free ? "免費" : "會員"}</td>
                <td>
                  <Link href={`/admin/articles/${a.id}`}>編輯</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
