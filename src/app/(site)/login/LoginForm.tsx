"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

function browserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("missing public supabase env");
  return createBrowserClient(url, key);
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErr(null);
    setMsg(null);
    try {
      const supabase = browserClient();
      if (mode === "signup") {
        const origin = window.location.origin;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });
        if (error) throw error;
        setMsg("若需驗證信箱，請至信箱點擊連結。已可嘗試登入。");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = nextPath;
      }
    } catch {
      setErr("無法完成，請檢查帳密或稍後再試。");
    } finally {
      setPending(false);
    }
  }

  async function onGoogle() {
    setPending(true);
    setErr(null);
    try {
      const supabase = browserClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) throw error;
    } catch {
      setErr("Google 登入需在 Supabase 開啟 Google Provider。");
      setPending(false);
    }
  }

  return (
    <div className="space-y-6" style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className={`tech-btn ${mode === "login" ? "tech-btn-primary" : "tech-btn-ghost"}`}
          onClick={() => setMode("login")}
        >
          登入
        </button>
        <button
          type="button"
          className={`tech-btn ${mode === "signup" ? "tech-btn-primary" : "tech-btn-ghost"}`}
          onClick={() => setMode("signup")}
        >
          新建帳戶
        </button>
      </div>

      <button
        type="button"
        className="tech-btn tech-btn-ghost"
        style={{ width: "100%" }}
        onClick={onGoogle}
        disabled={pending}
      >
        使用 Google 繼續
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "var(--t-dim)",
          fontSize: 12,
        }}
      >
        <span style={{ flex: 1, height: 1, background: "var(--t-line)" }} />
        Email
        <span style={{ flex: 1, height: 1, background: "var(--t-line)" }} />
      </div>

      <form onSubmit={onEmailSubmit}>
        <div className="tech-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="tech-field">
          <label htmlFor="password">密碼</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <p style={{ color: "#fca5a5", fontSize: 14 }}>{err}</p>}
        {msg && <p style={{ color: "var(--t-muted)", fontSize: 14 }}>{msg}</p>}
        <button
          type="submit"
          className="tech-btn tech-btn-primary"
          style={{ width: "100%" }}
          disabled={pending}
        >
          {pending ? "處理中…" : mode === "signup" ? "建立帳戶" : "登入"}
        </button>
      </form>
    </div>
  );
}
