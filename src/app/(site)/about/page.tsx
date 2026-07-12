import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/cms/store";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: "About",
    description: `${c.settings.siteName}——${c.settings.mentorTagline}。${c.settings.mentorEnglish}`,
  };
}

export default async function AboutPage() {
  const { about, settings } = await getContent();

  return (
    <article>
      <header className="border-b border-line py-16 sm:py-24">
        <div className="container-narrow">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
            {about.title}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted">{about.lead}</p>
        </div>
      </header>

      <div
        className="min-h-[40vh] w-full border-b border-line"
        style={{
          background:
            "linear-gradient(160deg, #f0ebe3 0%, #c4b5a0 40%, #6a5e52 85%)",
        }}
        aria-hidden
      />

      <div className="container-reading space-y-16 py-16 sm:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            {about.mentorTitle}
          </h2>
          <div className="prose-dc mt-6">
            {about.mentorParagraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className={
                  p === settings.mentorEnglish
                    ? "font-serif text-xl italic text-ink"
                    : undefined
                }
              >
                {p}
              </p>
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            {about.whatTitle}
          </h2>
          <ul className="mt-6 space-y-3 text-ink-soft">
            {about.whatItems.map((item, i) => (
              <li
                key={item}
                className={
                  i < about.whatItems.length - 1
                    ? "border-b border-line pb-3"
                    : "pb-1"
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <hr className="divider" />

        <section>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            {about.whyTitle}
          </h2>
          <div className="prose-dc mt-6">
            {about.whyParagraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
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
