import type { Metadata } from "next";
import Link from "next/link";
import { SubscribePlans } from "@/components/SubscribePlans";

export const metadata: Metadata = {
  title: "Subscribe · 23 Perspectives",
  description:
    "視角訂閱。給正在長的你。分享，不綁架；點醒，不代操。",
};

export default function SubscribePage() {
  return (
    <div className="pb-24">
      <header className="border-b border-line py-16 sm:py-20">
        <div className="container-narrow">
          <p className="eyebrow">Membership</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            23 Perspectives
          </h1>
          <p className="mt-5 text-lg text-muted">
            視角訂閱 · 給正在長的你
          </p>
        </div>
      </header>

      <div className="container-narrow space-y-16 py-14 sm:py-20">
        <section>
          <h2 className="font-serif text-2xl text-ink">你會收到什麼</h2>
          <ul className="mt-6 space-y-4 text-ink-soft">
            <li className="border-b border-line pb-4">
              有判斷的洞見（成長、品牌、創業現場）
            </li>
            <li className="border-b border-line pb-4">
              AI／新工具如何進入真實工作（不是功能清單）
            </li>
            <li className="pb-1">
              我正在想的事、做過的選擇——分享給你參考，不替你做主
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">這不是什麼</h2>
          <p className="mt-5 leading-relaxed text-muted">
            不是教練課、不是作業系統、不是要你每天打卡。
            你訂閱的是一段思想關係：我更新視角，你決定怎麼用。
          </p>
        </section>

        <section>
          <h2 className="mb-6 font-serif text-2xl text-ink">選擇方案</h2>
          <SubscribePlans />
        </section>

        <section className="border-t border-line pt-12">
          <h2 className="font-serif text-2xl text-ink">FAQ</h2>
          <dl className="mt-8 space-y-8">
            <div>
              <dt className="font-medium text-ink">多久更新？</dt>
              <dd className="mt-2 text-muted">
                以穩定節奏為主，不灌水。上線後會在此標明實際頻率（例如雙週一篇主視角）。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">適合誰？</dt>
              <dd className="mt-2 text-muted">
                想成長、想學新工具卻很亂、想有人分享視角但不想被綁著練的人。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">和顧問有什麼不同？</dt>
              <dd className="mt-2 text-muted">
                訂閱是思想與視角；顧問／演講是針對你的情境深度討論。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">可以先讀免費的嗎？</dt>
              <dd className="mt-2 text-muted">
                可以。
                <Link href="/perspectives" className="ml-1 underline underline-offset-4">
                  Perspectives
                </Link>{" "}
                有公開文章。
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
