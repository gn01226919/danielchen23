"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { deleteArticleAction, saveArticleAction } from "@/lib/cms/actions";
import type { Article, ArticleCategory } from "@/lib/cms/types";

const categories: ArticleCategory[] = ["成長", "品牌", "AI", "現場"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function ArticleForm({
  article,
  isNew,
}: {
  article: Article;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const title = String(fd.get("title") || "");
      let slug = String(fd.get("slug") || "").trim();
      if (!slug) slug = slugify(title) || `post-${Date.now()}`;
      const body = String(fd.get("body") || "")
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      await saveArticleAction({
        id: article.id,
        slug,
        title,
        excerpt: String(fd.get("excerpt") || ""),
        category: String(fd.get("category") || "成長") as ArticleCategory,
        date: String(fd.get("date") || article.date),
        readMinutes: Number(fd.get("readMinutes") || 5),
        featured: fd.get("featured") === "on",
        free: fd.get("free") === "on",
        published: fd.get("published") === "on",
        coverGradient: String(
          fd.get("coverGradient") || article.coverGradient,
        ),
        body: body.length ? body : [""],
      });
      setMsg("已儲存");
      if (isNew) router.push(`/admin/articles/${article.id}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("確定刪除此文？")) return;
    await deleteArticleAction(article.id);
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form action={onSubmit}>
      <div className="admin-card">
        <Field label="標題" name="title" defaultValue={article.title} />
        <Field
          label="Slug（網址）"
          name="slug"
          defaultValue={article.slug}
          hint="空白則依標題自動產生"
        />
        <Field
          label="摘要"
          name="excerpt"
          defaultValue={article.excerpt}
          multiline
        />
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="category">分類</label>
            <select
              id="category"
              name="category"
              defaultValue={article.category}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="日期"
            name="date"
            type="date"
            defaultValue={article.date}
          />
          <Field
            label="閱讀分鐘"
            name="readMinutes"
            type="number"
            defaultValue={article.readMinutes}
          />
        </div>
        <label className="admin-check">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article.published}
          />
          已發布
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={article.featured}
          />
          首頁精選
        </label>
        <label className="admin-check">
          <input type="checkbox" name="free" defaultChecked={article.free} />
          免費全文（取消勾選 = 會員付費牆）
        </label>
        <Field
          label="封面漸層 CSS"
          name="coverGradient"
          defaultValue={article.coverGradient}
        />
        <Field
          label="內文（段落之間空一行）"
          name="body"
          defaultValue={article.body.join("\n\n")}
          multiline
          tall
        />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
      {!isNew && (
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={onDelete}
          >
            刪除文章
          </button>
        </div>
      )}
    </form>
  );
}
