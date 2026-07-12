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
    } catch (ex) {
      setErr("無法完成，請檢查帳密或稍後再試。");
      console.error(ex);
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
      setErr("Google 登入無法啟動，請確認已在 Supabase 開啟 Google Provider。");
      setPending(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setMode("login")}
        >
          登入
        </button>
        <button
          type="button"
          className={`btn ${mode === "signup" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setMode("signup")}
        >
          新建帳戶
        </button>
      </div>

      <button
        type="button"
        className="btn btn-ghost w-full"
        onClick={onGoogle}
        disabled={pending}
      >
        使用 Google 繼續
      </button>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        或使用 Email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onEmailSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-muted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted" htmlFor="password">
            密碼
          </label>
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
            className="w-full border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
          />
        </div>
        {err && <p className="text-sm text-[#8b4a3a]">{err}</p>}
        {msg && <p className="text-sm text-muted">{msg}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? "處理中…" : mode === "signup" ? "建立帳戶" : "登入"}
        </button>
      </form>
    </div>
  );
}
