import Link from "next/link";
import { getContent } from "@/lib/cms/store";

export default async function HybridPreviewPage() {
  const content = await getContent();
  const { settings, home, narrativeFrames } = content;
  const featured = content.articles
    .filter((a) => a.featured && a.published)
    .slice(0, 4);

  return (
    <>
      <header className="hy-header">
        <div className="hy-wrap hy-header__inner">
          <Link href="/v/hybrid" className="hy-logo">
            <strong>{settings.siteName}</strong>
            <span>23 · {settings.product}</span>
          </Link>
          <nav className="hy-nav">
            <Link href="/perspectives">Perspectives</Link>
            <Link href="/about">About</Link>
            <Link href="/subscribe">Subscribe</Link>
            <Link href="/work-with-me">Work with me</Link>
          </nav>
          <Link href="/subscribe" className="hy-btn hy-btn-primary">
            訂閱
          </Link>
        </div>
      </header>

      <section className="hy-wrap hy-hero">
        <div>
          <p className="hy-mono">{home.heroEyebrow}</p>
          <h1>{settings.tagline}</h1>
          <p className="hy-hero__body">{home.heroBody}</p>
          <p className="hy-hero__quote">{settings.mentorEnglish}</p>
          <div className="hy-hero__actions">
            <Link href="/subscribe" className="hy-btn hy-btn-primary">
              {home.heroCtaPrimary}
            </Link>
            <Link href="/perspectives" className="hy-btn hy-btn-ghost">
              {home.heroCtaSecondary}
            </Link>
          </div>
        </div>
        <aside className="hy-side-panel">
          <div className="hy-side-panel__bar">system · identity</div>
          <dl>
            <div>
              <dt>Role</dt>
              <dd>Mentor</dd>
            </div>
            <div>
              <dt>Path</dt>
              <dd>{settings.mentorTagline}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>Brand × AI × Field</dd>
            </div>
            <div>
              <dt>Offer</dt>
              <dd>23 Perspectives</dd>
            </div>
          </dl>
        </aside>
      </section>

      <div className="hy-strip hy-wrap" style={{ width: "min(1100px, 100%)" }}>
        <div className="hy-strip__item">
          <span>01</span>
          <strong>Perspective</strong>
        </div>
        <div className="hy-strip__item">
          <span>02</span>
          <strong>Field notes</strong>
        </div>
        <div className="hy-strip__item">
          <span>03</span>
          <strong>AI leverage</strong>
        </div>
        <div className="hy-strip__item">
          <span>04</span>
          <strong>Lead the path</strong>
        </div>
      </div>

      <section className="hy-section">
        <div className="hy-wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p className="hy-mono">Statement</p>
          <h2>{home.statementTitle}</h2>
          <p className="lead" style={{ marginInline: "auto" }}>
            {home.statementBody}
          </p>
        </div>
      </section>

      <section className="hy-section">
        <div className="hy-wrap">
          <p className="hy-mono">Signals</p>
          <h2>現場訊號</h2>
          <p className="lead">紙感閱讀節奏 + 科技 bento 資訊密度。</p>
          <div className="hy-bento">
            {narrativeFrames.map((f, i) => (
              <div className="hy-card" key={f.id}>
                <div className="hy-card__idx">
                  0{i + 1} · {f.tone}
                </div>
                <h3>{f.caption}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hy-section">
        <div className="hy-wrap">
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
              <p className="hy-mono">Perspectives</p>
              <h2>{home.featuredTitle}</h2>
              <p className="lead">{home.featuredSubtitle}</p>
            </div>
            <Link href="/perspectives" className="hy-btn hy-btn-ghost">
              全部 →
            </Link>
          </div>
          <div className="hy-bento">
            {featured.map((a) => (
              <Link
                key={a.slug}
                href={`/perspectives/${a.slug}`}
                className="hy-card"
              >
                <div className="hy-card__idx">{a.date}</div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <div className="hy-chips">
                  <span className="hy-chip">{a.category}</span>
                  <span className={a.free ? "hy-chip" : "hy-chip hy-chip-on"}>
                    {a.free ? "free" : "members"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="hy-cta">
            <div>
              <h3>{home.subscribeTitle}</h3>
              <p>{home.subscribeSubtitle}</p>
            </div>
            <Link href="/subscribe" className="hy-btn hy-btn-primary">
              {home.subscribeCta}
            </Link>
          </div>
        </div>
      </section>

      <footer className="hy-footer">
        <div className="hy-wrap hy-footer__row">
          <div>
            <div style={{ color: "var(--hy-ink)", marginBottom: 4 }}>
              {settings.siteName}
            </div>
            {settings.footerLine}
          </div>
          <div>
            Hybrid preview ·{" "}
            <Link href="/v" style={{ textDecoration: "underline" }}>
              比較全部版本
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
