"use client";

import { createBrowserClient } from "@supabase/ssr";

export function SignOutButton() {
  async function signOut() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const supabase = createBrowserClient(url, key);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button type="button" className="tech-btn tech-btn-ghost" onClick={signOut}>
      登出
    </button>
  );
}
