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
          開發預設密碼見 <code>.env.example</code> 的{" "}
          <code>ADMIN_PASSWORD</code>（未設定時為{" "}
          <code>danielchen23</code>）。上線務必改掉。
        </p>
      </div>
    </div>
  );
}
