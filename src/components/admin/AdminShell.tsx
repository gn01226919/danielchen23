import { AdminNav } from "./AdminNav";

export function AdminShell({
  title,
  subtitle,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** 啟用全寬（表單 + 即時預覽） */
  wide?: boolean;
}) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className={wide ? "admin-main admin-main-wide" : "admin-main"}>
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}
