"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const base = "/v/tech";

const nav = [
  { href: `${base}/perspectives`, label: "Perspectives" },
  { href: `${base}/about`, label: "About" },
  { href: `${base}/subscribe`, label: "Subscribe" },
  { href: `${base}/work-with-me`, label: "Work with me" },
] as const;

export function TechHeader({
  siteName,
  product,
}: {
  siteName: string;
  product: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="tech-header">
      <div className="tech-wrap tech-header__inner">
        <Link href={base} className="tech-logo">
          <strong>{siteName}</strong>
          <span>23 · {product}</span>
        </Link>

        <nav className="tech-nav">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active ? "true" : "false"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="tech-header__right">
          <span className="tech-badge-live">tech build</span>
          <Link href={`${base}/subscribe`} className="tech-btn tech-btn-primary">
            訂閱
          </Link>
          <button
            type="button"
            className="tech-menu-btn"
            aria-label="選單"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="tech-wrap tech-mobile-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function TechFooter({
  siteName,
  footerLine,
  mentorTagline,
}: {
  siteName: string;
  footerLine: string;
  mentorTagline: string;
}) {
  return (
    <footer className="tech-footer">
      <div className="tech-wrap tech-footer__row">
        <div>
          <div className="tech-footer__brand">{siteName}</div>
          <div>{footerLine}</div>
          <div style={{ marginTop: 6, color: "var(--t-accent)" }}>
            {mentorTagline}
          </div>
        </div>
        <div className="tech-footer__links">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/">紙感主站</Link>
          <Link href="/v">Style lab</Link>
        </div>
      </div>
    </footer>
  );
}
