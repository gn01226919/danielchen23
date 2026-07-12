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

export function Header({
  siteName,
  mentorTagline,
}: {
  siteName: string;
  mentorTagline?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-lg tracking-tight text-ink">
            {siteName}
          </span>
          <span className="mt-0.5 text-[0.65rem] tracking-[0.18em] text-muted uppercase">
            23 · Perspectives
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors duration-150 ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/account"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            帳戶
          </Link>
          <Link href="/subscribe" className="btn btn-primary !py-2 !px-4 text-sm">
            訂閱
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-line md:hidden"
          aria-label={open ? "關閉選單" : "開啟選單"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-4 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base text-ink-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {mentorTagline && (
              <p className="py-2 text-xs text-muted">{mentorTagline}</p>
            )}
            <Link
              href="/account"
              className="py-3 text-base text-ink-soft"
              onClick={() => setOpen(false)}
            >
              帳戶
            </Link>
            <Link
              href="/contact"
              className="py-3 text-base text-ink-soft"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/subscribe"
              className="btn btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              訂閱 23 Perspectives
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
