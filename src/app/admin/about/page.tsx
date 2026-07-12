import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { AboutForm } from "./AboutForm";

export default async function AdminAboutPage() {
  const content = await getContent();
  return (
    <AdminShell
      title="About 頁"
      subtitle="左側編輯 → 右側即時預覽（綠框標示落點）。"
      wide
    >
      <AboutForm
        about={content.about}
        mentorEnglish={content.settings.mentorEnglish}
      />
    </AdminShell>
  );
}
