import type { Metadata } from "next";
import Link from "next/link";
import { WorkForm } from "@/components/WorkForm";

export const metadata: Metadata = {
  title: "Work with me",
  description: "演講、策略合作、顧問——給團隊或品牌一段深度對話。",
};

const offers = [
  {
    title: "演講",
    body: "品牌、成長、AI 進入真實工作的視角分享。",
  },
  {
    title: "策略合作",
    body: "品牌定位、行銷方向、成長節奏的共同推演。",
  },
  {
    title: "顧問",
    body: "針對你的情境深度討論（非長期教練陪跑）。",
  },
] as const;

export default function WorkWithMePage() {
  return (
    <div className="pb-24">
      <header className="border-b border-line py-16 sm:py-20">
        <div className="container-narrow">
          <p className="eyebrow">Collaborate</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            需要一個不同的視角？
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            演講、策略合作、顧問——給團隊或品牌一段深度對話。
            我帶來的是現場經驗與判斷，不是一套要你照抄的公式。
          </p>
        </div>
      </header>

      <div className="container-page py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((item) => (
            <div
              key={item.title}
              className="border border-line bg-paper-elevated p-7"
            >
              <h2 className="font-serif text-2xl text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl text-ink">留下訊息</h2>
            <p className="mt-4 text-muted">
              前端示意表單。後端階段會接到郵件或 CRM。
            </p>
            <p className="mt-8 text-sm text-muted">
              若你只是想先對齊思想，從{" "}
              <Link href="/subscribe" className="underline underline-offset-4">
                訂閱 23 Perspectives
              </Link>{" "}
              開始即可。
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <WorkForm />
          </div>
        </div>
      </div>
    </div>
  );
}
