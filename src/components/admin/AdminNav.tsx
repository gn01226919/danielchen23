"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/cms/actions";

const links = [
  { href: "/admin", label: "總覽", exact: true },
  { href: "/admin/settings", label: "全站設定" },
  { href: "/admin/theme", label: "主題色／CSS" },
  { href: "/admin/home", label: "首頁文案" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/frames", label: "影像敘事句" },
  { href: "/admin/perspectives-page", label: "Perspectives 頁" },
  { href: "/admin/articles", label: "文章" },
  { href: "/admin/subscribe", label: "訂閱／價格" },
  { href: "/admin/work", label: "Work with me" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-nav">
      <div className="admin-nav__brand">
        Daniel Chen
        <span>CMS · 23 Perspectives</span>
      </div>
      {links.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link key={l.href} href={l.href} data-active={active ? "true" : "false"}>
            {l.label}
          </Link>
        );
      })}
      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        <Link href="/" target="_blank" rel="noreferrer">
          開前台 ↗
        </Link>
        <form action={logoutAction} style={{ marginTop: "0.5rem" }}>
          <button type="submit" className="admin-btn admin-btn-ghost" style={{ width: "100%" }}>
            登出
          </button>
        </form>
      </div>
    </aside>
  );
}
