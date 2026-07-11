import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Daniel Chen——視角型 Mentor。23 是萌芽。分享品牌、成長與 AI，點亮方向後放手。",
};

export default function AboutPage() {
  return (
    <article>
      <header className="border-b border-line py-16 sm:py-24">
        <div className="container-narrow">
          <p className="eyebrow">About</p>
          <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
            還在萌芽的人，才有東西可分享。
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted">
            我是 Daniel Chen。23 對我來說是萌芽：不是終點的數字，是持續在長的提醒。
          </p>
        </div>
      </header>

      <div
        className="min-h-[40vh] w-full border-b border-line"
        style={{
          background:
            "linear-gradient(160deg, #f0ebe3 0%, #c4b5a0 40%, #6a5e52 85%)",
        }}
        aria-label="About 主視覺佔位"
      />

      <div className="container-reading space-y-16 py-16 sm:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            Mentor，不是教練
          </h2>
          <div className="prose-dc mt-6">
            <p>
              教練要求你照做；mentor 分享自己怎麼看，然後放手。
              我希望來這裡的人帶走視角，而不是複製我的人生。
            </p>
            <p>
              你若想成長、想碰新工具卻不得其門而入，又希望有一個有立場的人可以對齊——這裡為你而寫。
            </p>
          </div>
        </section>

        <hr className="divider" />

        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">我做什麼</h2>
          <ul className="mt-6 space-y-3 text-ink-soft">
            <li className="border-b border-line pb-3">連續創業</li>
            <li className="border-b border-line pb-3">品牌洞見與行銷策略</li>
            <li className="border-b border-line pb-3">科技與 AI builder</li>
            <li className="border-b border-line pb-3">現場經營（含理髮店）</li>
            <li className="pb-1">
              格鬥十年：比賽、教練與裁判——紀律與判斷的來源，不是名片主業
            </li>
          </ul>
        </section>

        <hr className="divider" />

        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            為什麼有這個站
          </h2>
          <div className="prose-dc mt-6">
            <p>
              danielchen23.com 是思想傳遞的地方：用訂閱把視角交給願意長的人；也承接演講、策略合作與顧問。
            </p>
            <p>
              23 Perspectives
              不是課程庫。它是一段可以長期對齊的思想關係——我更新視角，你決定怎麼用。
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/subscribe" className="btn btn-primary">
            訂閱 23 Perspectives
          </Link>
          <Link href="/perspectives" className="btn btn-ghost">
            看 Perspectives
          </Link>
          <Link href="/work-with-me" className="btn btn-ghost">
            談合作
          </Link>
        </div>
      </div>
    </article>
  );
}
