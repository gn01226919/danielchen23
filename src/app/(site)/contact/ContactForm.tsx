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
      <div className="tech-panel">
        <div className="tech-panel__body">
          <div className="out">message sent.</div>
          <div className="dim">我會親自看過。謝謝你的視角。</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
      <div className="tech-field">
        <label htmlFor="c-name">姓名（可選）</label>
        <input
          id="c-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="tech-field">
        <label htmlFor="c-email">你的 Email</label>
        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="tech-field">
        <label htmlFor="c-subject">主旨（可選）</label>
        <input
          id="c-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="tech-field">
        <label htmlFor="c-msg">訊息</label>
        <textarea
          id="c-msg"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {status === "err" && (
        <p style={{ color: "#fca5a5", fontSize: 14 }}>送出失敗，請稍後再試。</p>
      )}
      <button
        type="submit"
        className="tech-btn tech-btn-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "送出中…" : "送出"}
      </button>
    </form>
  );
}
