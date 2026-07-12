import type { Metadata } from "next";
import Link from "next/link";
import { SubscribePlans } from "@/components/SubscribePlans";
import { getContent } from "@/lib/cms/store";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: `Subscribe · ${c.settings.product}`,
    description: c.subscribe.subtitle,
  };
}

export default async function SubscribePage() {
  const { subscribe, pricing, settings } = await getContent();

  return (
    <div className="pb-24">
      <header className="border-b border-line py-16 sm:py-20">
        <div className="container-narrow">
          <p className="eyebrow">Membership</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            {subscribe.title}
          </h1>
          <p className="mt-5 text-lg text-muted">{subscribe.subtitle}</p>
          <p className="mt-4 font-serif text-lg italic text-ink-soft">
            {settings.mentorEnglish}
          </p>
        </div>
      </header>

      <div className="container-narrow space-y-16 py-14 sm:py-20">
        <section>
          <h2 className="font-serif text-2xl text-ink">{subscribe.receiveTitle}</h2>
          <ul className="mt-6 space-y-4 text-ink-soft">
            {subscribe.receiveItems.map((item, i) => (
              <li
                key={item}
                className={
                  i < subscribe.receiveItems.length - 1
                    ? "border-b border-line pb-4"
                    : "pb-1"
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">{subscribe.rhythmTitle}</h2>
          <p className="mt-5 leading-relaxed text-muted">{subscribe.rhythmBody}</p>
        </section>

        <section>
          <h2 className="mb-6 font-serif text-2xl text-ink">
            {subscribe.plansTitle}
          </h2>
          <SubscribePlans
            pricing={pricing}
            benefits={subscribe.planBenefits}
          />
        </section>

        <section className="border-t border-line pt-12">
          <h2 className="font-serif text-2xl text-ink">FAQ</h2>
          <dl className="mt-8 space-y-8">
            {subscribe.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-ink">{item.q}</dt>
                <dd className="mt-2 text-muted">
                  {item.a.includes("Perspectives") ? (
                    <>
                      可以。
                      <Link
                        href="/perspectives"
                        className="ml-1 underline underline-offset-4"
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
        </section>
      </div>
    </div>
  );
}
