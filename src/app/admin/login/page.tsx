import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>後台登入</h1>
        <p className="sub" style={{ marginBottom: "1.5rem" }}>
          Daniel Chen · 23 Perspectives CMS
        </p>
        <LoginForm />
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.75rem",
            color: "var(--admin-muted)",
            lineHeight: 1.5,
          }}
        >
          密碼設在 Vercel / <code>.env.local</code> 的{" "}
          <code>ADMIN_PASSWORD</code>（僅 server）。正式站改完後需重新部署。
          本機未設定時開發預設為 <code>danielchen23</code>；Production
          不會使用此預設。
        </p>
      </div>
    </div>
  );
}
