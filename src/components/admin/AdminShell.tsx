import { AdminNav } from "./AdminNav";

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-main">
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}
