import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { WorkAdminForm } from "./WorkAdminForm";

export default async function AdminWorkPage() {
  const content = await getContent();
  return (
    <AdminShell title="Work with me" subtitle="演講／策略／顧問文案。">
      <WorkAdminForm work={content.work} />
    </AdminShell>
  );
}
