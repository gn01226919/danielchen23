import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-muted/40">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl text-ink">{site.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {site.footerLine}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <hr className="divider my-10" />
        <div className="flex flex-col gap-2 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name} · {site.domain}</span>
          <span>23 = 萌芽 · Mentor，不是教練</span>
        </div>
      </div>
    </footer>
  );
}
