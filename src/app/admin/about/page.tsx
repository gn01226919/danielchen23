import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { AboutForm } from "./AboutForm";

export default async function AdminAboutPage() {
  const content = await getContent();
  return (
    <AdminShell
      title="About 頁"
      subtitle="Mentor 故事與肯定式文案。金句可與全站設定的英文句一致。"
    >
      <AboutForm about={content.about} />
    </AdminShell>
  );
}
