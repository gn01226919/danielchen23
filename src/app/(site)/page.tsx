import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getContent } from "@/lib/cms/store";

export default async function HomePage() {
  const content = await getContent();
  const { home, settings, narrativeFrames } = content;
  const featured = content.articles.filter((a) => a.featured && a.published);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-7">
            <p className="eyebrow rise">{home.heroEyebrow}</p>
            <h1 className="mt-5 font-serif text-[clamp(2.4rem,5.5vw,3.85rem)] text-ink rise rise-delay-1">
              {settings.tagline}
            </h1>
            <p className="mt-7 max-w-xl whitespace-pre-line text-base leading-relaxed text-muted sm:text-lg rise rise-delay-2">
              {home.heroBody}
            </p>
            <p className="mt-5 font-serif text-lg italic text-ink-soft rise rise-delay-2">
              {settings.mentorEnglish}
            </p>
            <div className="mt-10 flex flex-wrap gap-3 rise rise-delay-3">
              <Link href="/subscribe" className="btn btn-primary">
                {home.heroCtaPrimary}
              </Link>
              <Link href="/perspectives" className="btn btn-ghost">
                {home.heroCtaSecondary}
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
                <p className="whitespace-pre-line font-serif text-2xl leading-snug text-paper sm:text-3xl">
                  {home.heroImageNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            {home.statementTitle}
          </h2>
          <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted sm:text-lg">
            {home.statementBody}
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="grid sm:grid-cols-2">
          {narrativeFrames.map((frame) => (
            <div
              key={frame.id}
              className={`frame-panel tone-${frame.tone} border-b border-line sm:border-r sm:even:border-r-0`}
            >
              <p className="frame-caption">{frame.caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Perspectives</p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                {home.featuredTitle}
              </h2>
              <p className="mt-3 max-w-md text-muted">{home.featuredSubtitle}</p>
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
              {home.aboutTitle}
            </h2>
            <p className="mt-6 leading-relaxed text-muted">{home.aboutBody}</p>
            <Link href="/about" className="btn btn-ghost mt-8">
              {home.aboutCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line py-20 sm:py-24">
        <div className="container-narrow text-center">
          <p className="eyebrow">Membership</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            {home.subscribeTitle}
          </h2>
          <p className="mt-4 text-muted">{home.subscribeSubtitle}</p>
          <ul className="mx-auto mt-10 max-w-md space-y-3 text-left text-sm text-ink-soft sm:text-base">
            {home.subscribePoints.map((p, i) => (
              <li
                key={p}
                className={
                  i < home.subscribePoints.length - 1
                    ? "border-b border-line pb-3"
                    : "pb-1"
                }
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/subscribe" className="btn btn-primary">
              {home.subscribeCta}
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">{home.subscribeNote}</p>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-page flex flex-col items-start justify-between gap-8 border border-line bg-paper-elevated p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              {home.collabTitle}
            </h2>
            <p className="mt-4 text-muted">{home.collabBody}</p>
          </div>
          <Link href="/work-with-me" className="btn btn-ghost shrink-0">
            {home.collabCta}
          </Link>
        </div>
      </section>
    </>
  );
}
