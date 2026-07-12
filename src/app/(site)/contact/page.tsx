import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { getMembership } from "@/lib/server/membership";

export const metadata: Metadata = {
  title: "聯絡／回饋",
  description: "寫信給 Daniel — 回饋與想法。",
};

export default async function ContactPage() {
  const m = await getMembership();

  return (
    <div className="container-narrow py-16 sm:py-24">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">寫信給我</h1>
      <p className="mt-4 max-w-xl text-muted">
        會員或讀者的回饋、想法都可以從這裡送出。內容只會送到我的信箱與安全後端，不會出現在公開頁面。
      </p>
      <div className="mt-10">
        <ContactForm defaultEmail={m.email || ""} />
      </div>
    </div>
  );
}
