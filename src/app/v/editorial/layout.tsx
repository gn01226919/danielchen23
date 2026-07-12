import Link from "next/link";
import "./editorial.css";

export const metadata = {
  title: "Editorial preview · Daniel Chen",
  robots: { index: false, follow: false },
};

export default function EditorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ed-root">
      <div className="ed-banner">
        <span>
          <strong>預覽 C · 極簡黑白編輯室</strong>
          {" · "}
          雜誌 masthead · 無彩色強調
        </span>
        <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/v">全部預覽</Link>
          <Link href="/">紙感主站</Link>
          <Link href="/v/hybrid">混血</Link>
          <Link href="/v/tech">科技</Link>
        </span>
      </div>
      {children}
    </div>
  );
}
