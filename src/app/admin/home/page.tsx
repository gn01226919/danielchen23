import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { HomeForm } from "./HomeForm";

export default async function AdminHomePage() {
  const content = await getContent();
  return (
    <AdminShell title="首頁文案" subtitle="Hero、宣言、精選、訂閱區塊、合作。">
      <HomeForm home={content.home} />
    </AdminShell>
  );
}
