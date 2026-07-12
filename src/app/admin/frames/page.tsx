import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { FramesForm } from "./FramesForm";

export default async function AdminFramesPage() {
  const content = await getContent();
  return (
    <AdminShell
      title="影像敘事句"
      subtitle="首頁四幀色塊上的圖說（一行一句，順序 = 畫面順序）。"
    >
      <FramesForm frames={content.narrativeFrames} />
    </AdminShell>
  );
}
