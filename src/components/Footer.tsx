import Link from "next/link";

const nav = [
  { href: "/perspectives", label: "Perspectives" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/work-with-me", label: "Work with me" },
] as const;

export function Footer({
  siteName,
  domain,
  footerLine,
  mentorTagline,
}: {
  siteName: string;
  domain: string;
  footerLine: string;
  mentorTagline: string;
}) {
  return (
    <footer className="mt-auto border-t border-line bg-paper-muted/40">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl text-ink">{siteName}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{footerLine}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            {nav.map((item) => (
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
          <span>
            © {new Date().getFullYear()} {siteName} · {domain}
          </span>
          <span>23 = 萌芽 · {mentorTagline}</span>
        </div>
      </div>
    </footer>
  );
}
