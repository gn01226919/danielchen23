import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { ThemeForm } from "./ThemeForm";

export default async function AdminThemePage() {
  const content = await getContent();
  return (
    <AdminShell
      title="主題色／CSS"
      subtitle="左側改色 → 右側即時預覽落點。儲存後套用到 /v/tech。"
      wide
    >
      <ThemeForm theme={content.themeTech} />
    </AdminShell>
  );
}
