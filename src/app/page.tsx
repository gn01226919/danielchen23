import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getFeaturedArticles, narrativeFrames, site } from "@/data/site";

export default function HomePage() {
  const featured = getFeaturedArticles();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-7">
            <p className="eyebrow rise">23 = 萌芽 · Mentor</p>
            <h1 className="mt-5 font-serif text-[clamp(2.4rem,5.5vw,3.85rem)] text-ink rise rise-delay-1">
              {site.tagline}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg rise rise-delay-2">
              我是 Daniel Chen。在品牌、創業與 AI 的現場裡，分享我看見的角度。
              <br className="hidden sm:block" />
              Mentor，不是教練——點亮方向，其餘交給你。
            </p>
            <div className="mt-10 flex flex-wrap gap-3 rise rise-delay-3">
              <Link href="/subscribe" className="btn btn-primary">
                訂閱 23 Perspectives
              </Link>
              <Link href="/perspectives" className="btn btn-ghost">
                讀 Perspectives
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:h-full lg:min-h-[420px] lg:aspect-auto"
              style={{
                background:
                  "linear-gradient(155deg, #efe8dc 0%, #c9b8a0 38%, #7a6a58 72%, #2f2c29 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="font-serif text-2xl leading-snug text-paper sm:text-3xl">
                  在路上寫下的
                  <br />
                  視角筆記
                </p>
                <p className="mt-3 text-sm tracking-wide text-paper/75">
                  影像位 · 之後換你的攝影作品
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor 宣言 */}
      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            我不訓練你。我分享視角。
          </h2>
          <p className="mt-8 text-base leading-relaxed text-muted sm:text-lg">
            想成長的人，通常缺的不是更多資訊，而是一個有立場的角度，幫自己重新對焦。
            這裡沒有作業、沒有打卡、沒有要你變成誰。只有我怎麼看、怎麼選、怎麼錯——你拿走有用的，走自己的路。
          </p>
        </div>
      </section>

      {/* 影像敘事 */}
      <section className="border-b border-line">
        <div className="grid sm:grid-cols-2">
          {narrativeFrames.map((frame) => (
            <div
              key={frame.caption}
              className={`frame-panel tone-${frame.tone} border-b border-line sm:border-r sm:even:border-r-0`}
            >
              <p className="frame-caption">{frame.caption}</p>
            </div>
          ))}
        </div>
        <p className="container-page py-4 text-center text-xs tracking-wide text-muted">
          以影像節奏引導閱讀 · 正式照片可替換各幀背景
        </p>
      </section>

      {/* 精選 */}
      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Perspectives</p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                精選視角
              </h2>
              <p className="mt-3 max-w-md text-muted">
                先讀這些，感受這裡說話的方式。
              </p>
            </div>
            <Link
              href="/perspectives"
              className="text-sm text-ink-soft underline-offset-4 hover:underline"
            >
              看全部 Perspectives
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 關於短版 */}
      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <div
            className="aspect-[5/4] lg:col-span-5"
            style={{
              background:
                "linear-gradient(140deg, #e8e2d6 0%, #a89884 50%, #4a433c 100%)",
            }}
            aria-hidden
          />
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">About</p>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              在路上寫下的筆記
            </h2>
            <p className="mt-6 leading-relaxed text-muted">
              我是連續創業家，專長品牌洞見與行銷策略；也實際經營現場、打造科技與
              AI 相關事業。格鬥場上的十年給我紀律；店裡與產品裡的日常給我真實。
              danielchen23.com 是我分享思想的地方——為訂閱而寫，也為對的合作而開一扇門。
            </p>
            <Link href="/about" className="btn btn-ghost mt-8">
              About 完整故事
            </Link>
          </div>
        </div>
      </section>

      {/* 訂閱 */}
      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-narrow text-center">
          <p className="eyebrow">Membership</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            23 Perspectives
          </h2>
          <p className="mt-4 text-muted">
            視角訂閱。分享，不綁架；點醒，不代操。
          </p>
          <ul className="mx-auto mt-10 max-w-md space-y-3 text-left text-sm text-ink-soft sm:text-base">
            <li className="border-b border-line pb-3">
              有立場的成長與品牌洞見
            </li>
            <li className="border-b border-line pb-3">
              AI 與新工具，用「現場怎麼用」來說
            </li>
            <li className="pb-1">
              跟著一個還在路上的人對齊節奏——不是被訓練，是被點亮
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/subscribe" className="btn btn-primary">
              開始訂閱
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            可先讀免費文章，再決定是否訂閱。
          </p>
        </div>
      </section>

      {/* 合作 */}
      <section className="py-20 sm:py-24">
        <div className="container-page flex flex-col items-start justify-between gap-8 border border-line bg-paper-elevated p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              演講 · 策略合作 · 顧問
            </h2>
            <p className="mt-4 text-muted">
              若你的團隊需要一個不同的視角——品牌、成長或 AI
              如何進入真實工作——歡迎談合作。這不是一對一教練課；是深度對話與策略討論。
            </p>
          </div>
          <Link href="/work-with-me" className="btn btn-ghost shrink-0">
            Work with me
          </Link>
        </div>
      </section>
    </>
  );
}
