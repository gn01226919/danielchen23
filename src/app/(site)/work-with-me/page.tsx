import Link from "next/link";
import { TechWorkForm } from "@/components/tech/TechWorkForm";
import { getContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Work with me",
  description:
    "演講、策略合作與顧問。需要不同視角時，與 Daniel Chen 一起把洞見帶進現場。",
  path: "/work-with-me",
});

export default async function WorkWithMePage() {
  const { work } = await getContent();
  
  return (
    <>
      <header className="tech-page-header">
        <div className="tech-wrap-narrow">
          <p className="tech-kicker">// collaborate</p>
          <h1>{work.title}</h1>
          <p className="lead">{work.lead}</p>
        </div>
      </header>

      <div className="tech-wrap tech-section" style={{ borderBottom: 0 }}>
        <div className="tech-bento tech-bento-3">
          {work.offers.map((item, i) => (
            <div className="tech-card" key={item.title}>
              <div className="tech-card__idx">0{i + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>

        <div className="tech-work-grid">
          <div>
            <p className="tech-section__label">{work.formTitle}</p>
            <h2 style={{ fontSize: "1.4rem" }}>{work.formTitle}</h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              {work.formNote}
            </p>
            <p className="lead" style={{ marginTop: "1rem" }}>
              若你只是想先對齊思想，從{" "}
              <Link
                href={`/subscribe`}
                style={{
                  color: "var(--t-accent-2)",
                  textDecoration: "underline",
                }}
              >
                訂閱 23 Perspectives
              </Link>{" "}
              開始即可。
            </p>
          </div>
          <TechWorkForm />
        </div>
      </div>
    </>
  );
}
