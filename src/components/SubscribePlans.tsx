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
  const [status, setStatus] = useState<"idle" | "pending" | "mock">("idle");

  const selected = pricing[plan];

  function handleCheckout() {
    setStatus("pending");
    window.setTimeout(() => setStatus("mock"), 700);
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
          {status === "pending" ? "準備結帳…" : "前往付費訂閱"}
        </button>
        {status === "mock" && (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            前端示意已就緒。支付流程（Stripe）與會員權限會在後端階段接上；
            目前不會實際扣款。
          </p>
        )}
      </div>
    </div>
  );
}
