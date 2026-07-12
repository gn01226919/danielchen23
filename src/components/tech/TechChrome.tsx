"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/perspectives", label: "Perspectives" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/contact", label: "Contact" },
  { href: "/work-with-me", label: "Work with me" },
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
        <Link href="/" className="tech-logo">
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
          <Link
            href="/account"
            data-active={pathname.startsWith("/account") ? "true" : "false"}
          >
            Account
          </Link>
        </nav>

        <div className="tech-header__right">
          <Link href="/login" className="tech-btn tech-btn-ghost">
            登入
          </Link>
          <Link href="/subscribe" className="tech-btn tech-btn-primary">
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
          <Link href="/account" onClick={() => setOpen(false)}>
            Account
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            登入
          </Link>
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
          <Link href="/login">登入</Link>
          <Link href="/account">帳戶</Link>
        </div>
      </div>
    </footer>
  );
}
