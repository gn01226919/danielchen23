"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/cms/types";

type PlanId = "monthly" | "yearly";

export function SubscribePlans({
  pricing,
  benefits,
}: {
  pricing: SiteContent["pricing"];
  benefits: string[];
}) {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [status, setStatus] = useState<"idle" | "pending" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  const selected = pricing[plan];

  async function handleCheckout() {
    setStatus("pending");
    setErr(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as {
        url?: string;
        error?: string;
        code?: string;
      };

      if (res.status === 401 || data.code === "AUTH_REQUIRED") {
        window.location.href = `/login?next=${encodeURIComponent("/subscribe")}`;
        return;
      }
      if (!res.ok || !data.url) {
        setErr(data.error || "無法開始結帳（可能尚未設定 Stripe）");
        setStatus("err");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErr("無法開始結帳");
      setStatus("err");
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(pricing) as PlanId[]).map((id) => {
          const p = pricing[id];
          const active = plan === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPlan(id);
                setStatus("idle");
                setErr(null);
              }}
              className={`relative border p-6 text-left transition-colors duration-150 ${
                active
                  ? "border-ink bg-paper-elevated shadow-[var(--shadow-soft)]"
                  : "border-line bg-transparent hover:border-line-strong"
              }`}
            >
              {"badge" in p && p.badge && (
                <span className="absolute top-4 right-4 text-[0.65rem] tracking-[0.14em] text-accent uppercase">
                  {p.badge}
                </span>
              )}
              <p className="text-sm text-muted">{p.name}</p>
              <p className="mt-3 font-serif text-4xl text-ink">
                NT${p.price.toLocaleString("zh-TW")}
                <span className="ml-1 text-base text-muted">/ {p.period}</span>
              </p>
              <p className="mt-3 text-sm text-muted">{p.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="border border-line bg-paper-elevated p-6 sm:p-8">
        <p className="text-sm text-muted">你選擇</p>
        <p className="mt-1 font-serif text-2xl text-ink">
          {selected.name} · NT${selected.price.toLocaleString("zh-TW")} /{" "}
          {selected.period}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-ink-soft">
          {benefits.map((b) => (
            <li key={b}>· {b}</li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-primary mt-6 w-full sm:w-auto"
          onClick={handleCheckout}
          disabled={status === "pending"}
        >
          {status === "pending" ? "前往 Stripe…" : "登入後付費訂閱"}
        </button>
        {err && <p className="mt-4 text-sm text-[#8b4a3a]">{err}</p>}
        <p className="mt-4 text-xs text-muted">
          結帳由 Stripe 處理。未登入會先導向註冊／登入（含 Google）。
        </p>
      </div>
    </div>
  );
}
