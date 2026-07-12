import { AdminShell } from "@/components/admin/AdminShell";
import { getContent } from "@/lib/cms/store";
import { SubscribeForm } from "./SubscribeForm";

export default async function AdminSubscribePage() {
  const content = await getContent();
  return (
    <AdminShell title="訂閱／價格" subtitle="方案價格、利益點、FAQ。">
      <SubscribeForm subscribe={content.subscribe} pricing={content.pricing} />
    </AdminShell>
  );
}
