import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { PerspectivesPageForm } from "./PerspectivesPageForm";

export default async function AdminPerspectivesPageMeta() {
  const content = await getContent();
  return (
    <AdminShell title="Perspectives 列表頁" subtitle="列表頁標題與導語。">
      <PerspectivesPageForm perspectives={content.perspectives} />
    </AdminShell>
  );
}
