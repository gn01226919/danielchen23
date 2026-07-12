import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { ArticleForm } from "../ArticleForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditArticlePage({ params }: Props) {
  const { id } = await params;
  const content = await getContent();

  if (id === "new") {
    return (
      <AdminShell
        title="新增文章"
        subtitle="左側編輯 → 右側即時預覽。"
        wide
      >
        <ArticleForm
          article={{
            id: `a_${Date.now()}`,
            slug: "",
            title: "",
            excerpt: "",
            category: "成長",
            date: new Date().toISOString().slice(0, 10),
            readMinutes: 5,
            featured: false,
            free: true,
            published: true,
            coverGradient:
              "linear-gradient(145deg, #e8e2d6 0%, #c4b8a4 48%, #8a7f6e 100%)",
            body: [""],
          }}
          isNew
        />
      </AdminShell>
    );
  }

  const article = content.articles.find((a) => a.id === id);
  if (!article) notFound();

  return (
    <AdminShell
      title="編輯文章"
      subtitle={`${article.slug} · 左側改、右側即時預覽`}
      wide
    >
      <ArticleForm article={article} />
    </AdminShell>
  );
}
