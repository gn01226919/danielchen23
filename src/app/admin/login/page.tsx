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
          密碼僅存在 server 環境變數 <code>ADMIN_PASSWORD</code>
          （本機 <code>.env.local</code>／正式站 Vercel）。不會出現在前端程式碼。
        </p>
      </div>
    </div>
  );
}
