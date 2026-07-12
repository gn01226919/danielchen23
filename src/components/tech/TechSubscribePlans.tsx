"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/cms/types";

type PlanId = "monthly" | "yearly";

export function TechSubscribePlans({
  pricing,
  benefits,
}: {
  pricing: SiteContent["pricing"];
  benefits: string[];
}) {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [status, setStatus] = useState<"idle" | "pending" | "mock">("idle");
  const selected = pricing[plan];

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div className="tech-plans">
        {(Object.keys(pricing) as PlanId[]).map((id) => {
          const p = pricing[id];
          return (
            <button
              key={id}
              type="button"
              className="tech-plan"
              data-active={plan === id ? "true" : "false"}
              onClick={() => {
                setPlan(id);
                setStatus("idle");
              }}
            >
              <div className="tech-plan__name">
                {p.name}
                {"badge" in p && p.badge ? ` · ${p.badge}` : ""}
              </div>
              <div className="tech-plan__price">
                NT${p.price.toLocaleString("zh-TW")}
                <span> / {p.period}</span>
              </div>
              <div className="tech-plan__blurb">{p.blurb}</div>
            </button>
          );
        })}
      </div>

      <div className="tech-panel">
        <div className="tech-panel__bar">
          <span className="tech-panel__dot" />
          <span className="tech-panel__dot" />
          <span className="tech-panel__dot" />
          <span className="tech-panel__title">checkout.preview</span>
        </div>
        <div className="tech-panel__body">
          <div>
            <span className="dim">plan</span>{" "}
            <span className="out">
              {selected.name} · NT${selected.price.toLocaleString("zh-TW")}/
              {selected.period}
            </span>
          </div>
          {benefits.map((b) => (
            <div key={b}>
              <span className="cmd">+</span> <span className="kw">{b}</span>
            </div>
          ))}
          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="tech-btn tech-btn-primary"
              onClick={() => {
                setStatus("pending");
                window.setTimeout(() => setStatus("mock"), 700);
              }}
              disabled={status === "pending"}
            >
              {status === "pending" ? "準備結帳…" : "前往付費訂閱"}
            </button>
          </div>
          {status === "mock" && (
            <div className="dim" style={{ marginTop: "0.75rem" }}>
              # Stripe 尚未接線 · 此為科技版 UI 示意
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
