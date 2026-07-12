import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { about, settings } = await getContent();
  
  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">{about.eyebrow}</p>
          <h1>{about.title}</h1>
          <p className="lead">{about.lead}</p>
        </div>
      </header>

      <div
        className="tech-cover"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #134e4a 40%, #0c4a6e 100%)",
        }}
      />

      <div className="tech-wrap-read tech-section" style={{ borderBottom: 0 }}>
        <p className="tech-section__label">Mentor</p>
        <h2>{about.mentorTitle}</h2>
        <div className="tech-prose">
          {about.mentorParagraphs.map((p) =>
            p === settings.mentorEnglish ? (
              <p key={p} className="tech-quote" style={{ marginTop: "1.25rem" }}>
                {p}
              </p>
            ) : (
              <p key={p.slice(0, 40)}>{p}</p>
            ),
          )}
        </div>

        <hr className="tech-divider" />

        <p className="tech-section__label">{about.whatTitle}</p>
        <ul className="tech-list">
          {about.whatItems.map((item) => (
            <li key={item}>
              <span className="tech-chip tech-chip-accent" style={{ marginRight: 8 }}>
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>

        <hr className="tech-divider" />

        <p className="tech-section__label">{about.whyTitle}</p>
        <div className="tech-prose">
          {about.whyParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.65rem",
            marginTop: "2rem",
          }}
        >
          <Link href={`/subscribe`} className="tech-btn tech-btn-primary">
            訂閱 23 Perspectives
          </Link>
          <Link
            href={`/perspectives`}
            className="tech-btn tech-btn-ghost"
          >
            Perspectives
          </Link>
          <Link
            href={`/work-with-me`}
            className="tech-btn tech-btn-ghost"
          >
            談合作
          </Link>
        </div>
      </div>
    </>
  );
}
