import Link from "next/link";
import { TechSubscribePlans } from "@/components/tech/TechSubscribePlans";
import { getContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Subscribe",
  description:
    "訂閱 23 Perspectives——有立場的成長、品牌與 AI 視角。Mentor 引領前路，路仍由你走。",
  path: "/subscribe",
});

export default async function SubscribePage() {
  const { subscribe, pricing, settings } = await getContent();
  
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
                        href={`/perspectives`}
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
