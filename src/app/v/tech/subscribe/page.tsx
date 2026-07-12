import type { Metadata } from "next";
import Link from "next/link";
import { TechSubscribePlans } from "@/components/tech/TechSubscribePlans";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = { title: "Subscribe" };

export default async function TechSubscribePage() {
  const { subscribe, pricing, settings } = await getContent();
  const base = "/v/tech";

  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">// membership</p>
          <h1>{subscribe.title}</h1>
          <p className="lead">{subscribe.subtitle}</p>
          <p className="tech-quote">{settings.mentorEnglish}</p>
        </div>
      </header>

      <div className="tech-wrap-narrow tech-section" style={{ borderBottom: 0 }}>
        <p className="tech-section__label">{subscribe.receiveTitle}</p>
        <ul className="tech-list">
          {subscribe.receiveItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div style={{ marginTop: "2.5rem" }}>
          <p className="tech-section__label">{subscribe.rhythmTitle}</p>
          <h2 style={{ fontSize: "1.35rem" }}>{subscribe.rhythmTitle}</h2>
          <p className="lead">{subscribe.rhythmBody}</p>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <p className="tech-section__label">{subscribe.plansTitle}</p>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>
            {subscribe.plansTitle}
          </h2>
          <TechSubscribePlans
            pricing={pricing}
            benefits={subscribe.planBenefits}
          />
        </div>

        <div style={{ marginTop: "2.75rem" }}>
          <p className="tech-section__label">FAQ</p>
          <dl className="tech-faq">
            {subscribe.faq.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>
                  {item.a.includes("Perspectives") ? (
                    <>
                      可以。
                      <Link
                        href={`${base}/perspectives`}
                        style={{
                          color: "var(--t-accent-2)",
                          textDecoration: "underline",
                          marginLeft: 4,
                        }}
                      >
                        Perspectives
                      </Link>{" "}
                      有公開文章。
                    </>
                  ) : (
                    item.a
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
