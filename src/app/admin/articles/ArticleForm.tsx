"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
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
  const [values, setValues] = useState(article);
  const [bodyText, setBodyText] = useState(article.body.join("\n\n"));
  const [focus, setFocus] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Article>(key: K, value: Article[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      let slug = values.slug.trim();
      if (!slug) slug = slugify(values.title) || `post-${Date.now()}`;
      const body = bodyText
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      await saveArticleAction({
        ...values,
        slug,
        body: body.length ? body : [""],
      });
      setMsg("已儲存");
      if (isNew) router.push(`/admin/articles/${article.id}`);
      router.refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "儲存失敗");
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

  const bodyPreview = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-split">
        <div className="admin-split__form">
          <div className="admin-card">
            <Field
              label="標題"
              name="title"
              value={values.title}
              onChange={(v) => set("title", v)}
              onFocus={() => setFocus("title")}
              active={focus === "title"}
            />
            <Field
              label="Slug"
              name="slug"
              value={values.slug}
              onChange={(v) => set("slug", v)}
              onFocus={() => setFocus("slug")}
              active={focus === "slug"}
              hint="空白則依標題自動產生"
            />
            <Field
              label="摘要"
              name="excerpt"
              value={values.excerpt}
              onChange={(v) => set("excerpt", v)}
              onFocus={() => setFocus("excerpt")}
              active={focus === "excerpt"}
              multiline
            />
            <div className="admin-grid-2">
              <div className="admin-field">
                <label htmlFor="category">分類</label>
                <select
                  id="category"
                  value={values.category}
                  onChange={(e) =>
                    set("category", e.target.value as ArticleCategory)
                  }
                  onFocus={() => setFocus("meta")}
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
                value={values.date}
                onChange={(v) => set("date", v)}
                onFocus={() => setFocus("meta")}
                active={focus === "meta"}
              />
              <Field
                label="閱讀分鐘"
                name="readMinutes"
                type="number"
                value={values.readMinutes}
                onChange={(v) => set("readMinutes", Number(v) || 0)}
                onFocus={() => setFocus("meta")}
                active={focus === "meta"}
              />
            </div>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={values.published}
                onChange={(e) => set("published", e.target.checked)}
                onFocus={() => setFocus("meta")}
              />
              已發布
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => set("featured", e.target.checked)}
                onFocus={() => setFocus("meta")}
              />
              首頁精選
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={values.free}
                onChange={(e) => set("free", e.target.checked)}
                onFocus={() => setFocus("paywall")}
              />
              免費全文（取消 = 會員牆）
            </label>
            <Field
              label="封面漸層 CSS"
              name="coverGradient"
              value={values.coverGradient}
              onChange={(v) => set("coverGradient", v)}
              onFocus={() => setFocus("cover")}
              active={focus === "cover"}
            />
            <div
              className={`admin-field${focus === "body" ? " admin-field-active" : ""}`}
            >
              <label htmlFor="body">內文（段落之間空一行）</label>
              <textarea
                id="body"
                className="tall"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                onFocus={() => setFocus("body")}
              />
            </div>
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
        </div>

        <LivePreviewPane
          title="文章即時預覽"
          hint={focus ? `聚焦：${focus}` : "打字即更新"}
        >
          <div
            style={{
              background: "#f7f4ef",
              color: "#1c1b19",
              minHeight: 520,
              fontFamily: "system-ui, sans-serif",
              fontSize: 13,
            }}
          >
            <div
              className={focus === "cover" ? "admin-preview-hot" : undefined}
              style={{
                height: 120,
                background: values.coverGradient || "#ccc",
              }}
            />
            <div style={{ padding: "18px 16px 24px" }}>
              <div
                className={focus === "meta" ? "admin-preview-hot" : undefined}
                style={{
                  fontSize: 11,
                  color: "#7a756c",
                  fontFamily: "ui-monospace, monospace",
                  marginBottom: 8,
                }}
              >
                {values.category} · {values.date} · {values.readMinutes} min
                {!values.free ? " · members" : ""}
                {values.featured ? " · 精選" : ""}
                {!values.published ? " · 草稿" : ""}
              </div>
              <div
                className={focus === "title" ? "admin-preview-hot" : undefined}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 22,
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {values.title || "（標題）"}
              </div>
              <div
                className={focus === "slug" ? "admin-preview-hot" : undefined}
                style={{ fontSize: 11, color: "#7a756c", marginBottom: 10 }}
              >
                /perspectives/{values.slug || "…"}
              </div>
              <div
                className={focus === "excerpt" ? "admin-preview-hot" : undefined}
                style={{ color: "#7a756c", lineHeight: 1.55, marginBottom: 16 }}
              >
                {values.excerpt || "（摘要）"}
              </div>
              <div
                className={focus === "body" ? "admin-preview-hot" : undefined}
              >
                {(bodyPreview.length ? bodyPreview : ["（內文）"])
                  .slice(0, values.free ? 20 : 2)
                  .map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      style={{
                        margin: "0 0 12px",
                        lineHeight: 1.65,
                        color: "#3f3c37",
                      }}
                    >
                      {p}
                    </p>
                  ))}
              </div>
              {!values.free && (
                <div
                  className={
                    focus === "paywall" ? "admin-preview-hot" : undefined
                  }
                  style={{
                    marginTop: 8,
                    padding: 14,
                    border: "1px solid #cfc6b8",
                    background: "#fffcf7",
                    fontSize: 12,
                    color: "#5c4a3a",
                  }}
                >
                  會員牆預覽 — 取消「免費全文」時出現
                </div>
              )}
            </div>
          </div>
        </LivePreviewPane>
      </div>
    </form>
  );
}
