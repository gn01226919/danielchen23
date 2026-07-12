"use client";

import { useState } from "react";
import { loginAction } from "@/lib/cms/actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await loginAction(formData);
    if (res && !res.ok) {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <form action={onSubmit}>
      <div className="admin-field">
        <label htmlFor="password">管理密碼</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="admin-toast-err">{error}</p>}
      <div className="admin-actions">
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={pending}
          style={{ width: "100%" }}
        >
          {pending ? "登入中…" : "進入後台"}
        </button>
      </div>
    </form>
  );
}
