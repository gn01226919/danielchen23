import { Figtree, Newsreader } from "next/font/google";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import "./admin.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Admin · Daniel Chen",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  return (
    <div
      className={`admin-shell ${newsreader.variable} ${figtree.variable}`}
    >
      {children}
      {/* 供子頁判斷是否已登入時可用；login 頁不包 nav */}
      <span className="sr-only" data-admin-authed={authed ? "1" : "0"} />
    </div>
  );
}
