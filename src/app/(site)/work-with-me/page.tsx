import type { Metadata } from "next";
import Link from "next/link";
import { WorkForm } from "@/components/WorkForm";
import { getContent } from "@/lib/cms/store";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: "Work with me",
    description: c.work.lead,
  };
}

export default async function WorkWithMePage() {
  const { work } = await getContent();

  return (
    <div className="pb-24">
      <header className="border-b border-line py-16 sm:py-20">
        <div className="container-narrow">
          <p className="eyebrow">Collaborate</p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{work.lead}</p>
        </div>
      </header>

      <div className="container-page py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {work.offers.map((item) => (
            <div
              key={item.title}
              className="border border-line bg-paper-elevated p-7"
            >
              <h2 className="font-serif text-2xl text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl text-ink">{work.formTitle}</h2>
            <p className="mt-4 text-muted">{work.formNote}</p>
            <p className="mt-8 text-sm text-muted">
              {work.formFooter.includes("訂閱") ? (
                <>
                  若你只是想先對齊思想，從{" "}
                  <Link href="/subscribe" className="underline underline-offset-4">
                    訂閱 23 Perspectives
                  </Link>{" "}
                  開始即可。
                </>
              ) : (
                work.formFooter
              )}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <WorkForm />
          </div>
        </div>
      </div>
    </div>
  );
}
