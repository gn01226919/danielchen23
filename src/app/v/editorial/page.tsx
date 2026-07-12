import Link from "next/link";
import { getContent } from "@/lib/cms/store";

export default async function EditorialPreviewPage() {
  const content = await getContent();
  const { settings, home, narrativeFrames } = content;
  const featured = content.articles
    .filter((a) => a.published)
    .slice(0, 4);

  return (
    <>
      <header className="ed-header">
        <div className="ed-wrap-wide ed-header__inner">
          <Link href="/v/editorial" className="ed-masthead">
            {settings.siteName}
            <small>Vol. 23 · {settings.product}</small>
          </Link>
          <nav className="ed-nav">
            <Link href="/perspectives">Perspectives</Link>
            <Link href="/about">About</Link>
            <Link href="/subscribe">Subscribe</Link>
            <Link href="/work-with-me">Work</Link>
          </nav>
        </div>
      </header>

      <section className="ed-hero ed-wrap">
        <p className="vol">{home.heroEyebrow}</p>
        <h1>{settings.tagline}</h1>
        <div className="ed-hero__rule" />
        <p className="ed-hero__body">{home.heroBody}</p>
        <p className="ed-hero__quote">{settings.mentorEnglish}</p>
        <div className="ed-hero__actions">
          <Link href="/subscribe" className="ed-btn ed-btn-fill">
            {home.heroCtaPrimary}
          </Link>
          <Link href="/perspectives" className="ed-btn ed-btn-line">
            {home.heroCtaSecondary}
          </Link>
        </div>
      </section>

      <section className="ed-wrap ed-cols">
        <div>
          <p className="ed-section__label">Statement</p>
          <h2>{home.statementTitle}</h2>
          <p>{home.statementBody}</p>
        </div>
        <div>
          <p className="ed-section__label">About</p>
          <h2>{home.aboutTitle}</h2>
          <p>{home.aboutBody}</p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/about" className="ed-btn ed-btn-line">
              {home.aboutCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="ed-section">
        <div className="ed-wrap">
          <p className="ed-section__label">Field notes</p>
          <div className="ed-frames">
            {narrativeFrames.map((f, i) => (
              <article key={f.id}>
                <div className="ed-frames__no">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p>{f.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-section">
        <div className="ed-wrap">
          <p className="ed-section__label">Perspectives</p>
          <h2
            style={{
              fontFamily: "var(--ed-serif)",
              fontSize: "2rem",
              fontWeight: 500,
              margin: "0 0 1.5rem",
            }}
          >
            {home.featuredTitle}
          </h2>
          <ul className="ed-list">
            {featured.map((a) => (
              <li key={a.slug}>
                <Link href={`/perspectives/${a.slug}`}>
                  <span className="ed-list__meta">
                    {a.category} · {a.date}
                    {!a.free ? " · Members" : ""}
                  </span>
                  <span className="ed-list__title">{a.title}</span>
                  <span className="ed-list__excerpt">{a.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/perspectives" className="ed-btn ed-btn-line">
              Index →
            </Link>
          </div>
        </div>
      </section>

      <section className="ed-section">
        <div className="ed-wrap" style={{ textAlign: "center" }}>
          <p className="ed-section__label">Membership</p>
          <h2
            style={{
              fontFamily: "var(--ed-serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 500,
              margin: "0 0 0.75rem",
            }}
          >
            {home.subscribeTitle}
          </h2>
          <p style={{ color: "var(--ed-muted)", maxWidth: 420, margin: "0 auto" }}>
            {home.subscribeSubtitle}
          </p>
          <div style={{ marginTop: "1.75rem" }}>
            <Link href="/subscribe" className="ed-btn ed-btn-fill">
              {home.subscribeCta}
            </Link>
          </div>
        </div>
      </section>

      <footer className="ed-wrap-wide ed-footer">
        <span>
          {settings.siteName} · {settings.domain}
        </span>
        <span>
          Editorial preview ·{" "}
          <Link href="/v" style={{ textDecoration: "underline" }}>
            All previews
          </Link>
        </span>
      </footer>
    </>
  );
}
