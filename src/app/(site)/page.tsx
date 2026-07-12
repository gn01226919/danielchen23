import Link from "next/link";
import { getContent } from "@/lib/cms/store";

export default async function HomePage() {
  const content = await getContent();
  const { settings, home, narrativeFrames } = content;
  const featured = content.articles
    .filter((a) => a.featured && a.published)
    .slice(0, 3);

  return (
    <>
      <section className="tech-hero">
        <div className="tech-wrap tech-hero__grid">
          <div>
            <p className="tech-kicker">
              <span>//</span> {home.heroEyebrow}
            </p>
            <h1>{settings.tagline}</h1>
            <p className="tech-hero__body">{home.heroBody}</p>
            <p className="tech-quote">{settings.mentorEnglish}</p>
            <div className="tech-hero__actions">
              <Link href={`/subscribe`} className="tech-btn tech-btn-primary">
                {home.heroCtaPrimary}
              </Link>
              <Link
                href={`/perspectives`}
                className="tech-btn tech-btn-ghost"
              >
                {home.heroCtaSecondary}
              </Link>
            </div>
          </div>

          <div className="tech-panel" aria-hidden>
            <div className="tech-panel__bar">
              <span className="tech-panel__dot" />
              <span className="tech-panel__dot" />
              <span className="tech-panel__dot" />
              <span className="tech-panel__title">mentor.session — zsh</span>
            </div>
            <div className="tech-panel__body">
              <div>
                <span className="dim">$</span>{" "}
                <span className="cmd">whoami</span>
              </div>
              <div className="out">{settings.siteName} · mentor</div>
              <div style={{ height: "0.55rem" }} />
              <div>
                <span className="dim">$</span>{" "}
                <span className="cmd">cat ./mission.md</span>
              </div>
              <div className="out">{settings.mentorTagline}</div>
              <div className="dim"># lead the path · share perspective</div>
              <div style={{ height: "0.55rem" }} />
              <div>
                <span className="dim">$</span>{" "}
                <span className="cmd">echo $MANTRA</span>
              </div>
              <div className="kw">{settings.mentorEnglish}</div>
              <div style={{ height: "0.55rem" }} />
              <div>
                <span className="dim">$</span>{" "}
                <span className="cmd">./grow --with-ai --from-field</span>
              </div>
              <div className="out">✓ brand · growth · leverage</div>
              <div>
                <span className="dim">$</span> <span className="cmd">_</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tech-stats">
        <div className="tech-stat">
          <div className="tech-stat__label">Role</div>
          <div className="tech-stat__value">Mentor</div>
        </div>
        <div className="tech-stat">
          <div className="tech-stat__label">Product</div>
          <div className="tech-stat__value">23 Perspectives</div>
        </div>
        <div className="tech-stat">
          <div className="tech-stat__label">Focus</div>
          <div className="tech-stat__value">Brand × AI</div>
        </div>
        <div className="tech-stat">
          <div className="tech-stat__label">Signal</div>
          <div className="tech-stat__value">Field notes</div>
        </div>
      </div>

      <section className="tech-section">
        <div className="tech-wrap-narrow" style={{ textAlign: "center" }}>
          <p className="tech-section__label">Statement</p>
          <h2>{home.statementTitle}</h2>
          <p className="lead" style={{ marginInline: "auto" }}>
            {home.statementBody}
          </p>
        </div>
      </section>

      <section className="tech-section">
        <div className="tech-wrap">
          <p className="tech-section__label">Signals</p>
          <h2>視角模組 · 四則現場訊號</h2>
          <p className="lead">現場洞見，編成可掃的資訊卡。</p>
          <div className="tech-bento">
            {narrativeFrames.map((frame, i) => (
              <div className="tech-card" key={frame.id}>
                <div className="tech-card__idx">
                  0{i + 1} / {frame.tone}
                </div>
                <h3>{frame.caption}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="tech-wrap">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div>
              <p className="tech-section__label">Perspectives</p>
              <h2>{home.featuredTitle}</h2>
              <p className="lead">{home.featuredSubtitle}</p>
            </div>
            <Link
              href={`/perspectives`}
              className="tech-btn tech-btn-ghost"
            >
              全部文章 →
            </Link>
          </div>
          <div className="tech-bento">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/perspectives/${article.slug}`}
                className="tech-card"
              >
                <div className="tech-card__idx">{article.date}</div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="tech-card-meta">
                  <span className="tech-chip">{article.category}</span>
                  <span
                    className={
                      article.free ? "tech-chip" : "tech-chip tech-chip-accent"
                    }
                  >
                    {article.free ? "free" : "members"}
                  </span>
                  <span className="tech-chip">{article.readMinutes} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="tech-wrap">
          <p className="tech-section__label">About</p>
          <h2>{home.aboutTitle}</h2>
          <p className="lead">{home.aboutBody}</p>
          <div style={{ marginTop: "1.25rem" }}>
            <Link href={`/about`} className="tech-btn tech-btn-ghost">
              {home.aboutCta}
            </Link>
          </div>

          <div className="tech-cta">
            <div>
              <h2>{home.subscribeTitle}</h2>
              <p>{home.subscribeSubtitle}</p>
            </div>
            <Link
              href={`/subscribe`}
              className="tech-btn tech-btn-primary"
            >
              {home.subscribeCta}
            </Link>
          </div>

          <div className="tech-cta" style={{ marginTop: "0.75rem" }}>
            <div>
              <h2>{home.collabTitle}</h2>
              <p>{home.collabBody}</p>
            </div>
            <Link
              href={`/work-with-me`}
              className="tech-btn tech-btn-ghost"
            >
              {home.collabCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
