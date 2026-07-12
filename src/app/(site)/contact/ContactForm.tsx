"use client";

import { useState } from "react";

export function ContactForm({ defaultEmail }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, subject, message }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setMessage("");
      setSubject("");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-line bg-paper-elevated p-8">
        <p className="font-serif text-2xl text-ink">已送出。</p>
        <p className="mt-3 text-muted">我會親自看過。謝謝你的視角。</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="c-name">
          姓名（可選）
        </label>
        <input
          id="c-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="c-email">
          你的 Email
        </label>
        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="c-subject">
          主旨（可選）
        </label>
        <input
          id="c-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="c-msg">
          訊息
        </label>
        <textarea
          id="c-msg"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y border border-line bg-paper-elevated px-4 py-3 outline-none focus:border-ink"
        />
      </div>
      {status === "err" && (
        <p className="text-sm text-[#8b4a3a]">送出失敗，請稍後再試。</p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "送出中…" : "送出"}
      </button>
    </form>
  );
}
