import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { ThemeForm } from "./ThemeForm";

export default async function AdminThemePage() {
  const content = await getContent();
  return (
    <AdminShell
      title="主題色／CSS"
      subtitle="主要影響 /v/tech 科技站。改完儲存後開科技站確認。"
    >
      <ThemeForm theme={content.themeTech} />
    </AdminShell>
  );
}
