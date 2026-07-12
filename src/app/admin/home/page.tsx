import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { HomeForm } from "./HomeForm";

export default async function AdminHomePage() {
  const content = await getContent();
  return (
    <AdminShell
      title="首頁文案"
      subtitle="左側編輯 → 右側即時預覽對應區塊（綠框）。"
      wide
    >
      <HomeForm
        home={content.home}
        tagline={content.settings.tagline}
        mentorEnglish={content.settings.mentorEnglish}
      />
    </AdminShell>
  );
}
