import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const content = await getContent();
  return (
    <AdminShell
      title="全站設定"
      subtitle="左側改 → 右側即時預覽 Header／Hero／Footer 落點。"
      wide
    >
      <SettingsForm settings={content.settings} />
    </AdminShell>
  );
}
