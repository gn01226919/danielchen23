import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const content = await getContent();
  return (
    <AdminShell
      title="全站設定"
      subtitle="站名、金句、頁尾——影響 Header / Footer / 多處引用。"
    >
      <SettingsForm settings={content.settings} />
    </AdminShell>
  );
}
