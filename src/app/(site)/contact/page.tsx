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
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">// contact</p>
          <h1>寫信給我</h1>
          <p className="lead">
            回饋與想法從這裡送出。內容只經 server 轉寄到我的信箱，不會出現在公開頁。
          </p>
        </div>
      </header>
      <div className="tech-wrap-narrow tech-section" style={{ borderBottom: 0 }}>
        <ContactForm defaultEmail={m.email || ""} />
      </div>
    </>
  );
}
