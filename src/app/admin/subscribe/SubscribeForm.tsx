"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveSubscribeAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

function lines(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function SubscribeForm({
  subscribe,
  pricing,
}: {
  subscribe: SiteContent["subscribe"];
  pricing: SiteContent["pricing"];
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const faqRaw = String(fd.get("faq") || "");
      const faq = faqRaw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [q, ...rest] = line.split("|");
          return { q: (q || "").trim(), a: rest.join("|").trim() };
        })
        .filter((x) => x.q && x.a);

      await saveSubscribeAction({
        subscribe: {
          title: String(fd.get("title") || ""),
          subtitle: String(fd.get("subtitle") || ""),
          receiveTitle: String(fd.get("receiveTitle") || ""),
          receiveItems: lines(String(fd.get("receiveItems") || "")),
          rhythmTitle: String(fd.get("rhythmTitle") || ""),
          rhythmBody: String(fd.get("rhythmBody") || ""),
          plansTitle: String(fd.get("plansTitle") || ""),
          planBenefits: lines(String(fd.get("planBenefits") || "")),
          faq: faq.length ? faq : subscribe.faq,
        },
        pricing: {
          monthly: {
            name: String(fd.get("m_name") || ""),
            price: Number(fd.get("m_price") || 0),
            period: String(fd.get("m_period") || "月"),
            blurb: String(fd.get("m_blurb") || ""),
          },
          yearly: {
            name: String(fd.get("y_name") || ""),
            price: Number(fd.get("y_price") || 0),
            period: String(fd.get("y_period") || "年"),
            blurb: String(fd.get("y_blurb") || ""),
            badge: String(fd.get("y_badge") || ""),
          },
        },
      });
      setMsg("已儲存");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={onSubmit}>
      <div className="admin-card">
        <h2>頁面文案</h2>
        <Field label="標題" name="title" defaultValue={subscribe.title} />
        <Field label="副標" name="subtitle" defaultValue={subscribe.subtitle} />
        <Field label="你會收到·標題" name="receiveTitle" defaultValue={subscribe.receiveTitle} />
        <Field
          label="你會收到·項目（一行一項）"
          name="receiveItems"
          defaultValue={subscribe.receiveItems.join("\n")}
          multiline
        />
        <Field label="節奏·標題" name="rhythmTitle" defaultValue={subscribe.rhythmTitle} />
        <Field label="節奏·內文" name="rhythmBody" defaultValue={subscribe.rhythmBody} multiline />
        <Field label="方案區標題" name="plansTitle" defaultValue={subscribe.plansTitle} />
        <Field
          label="方案利益（一行一點）"
          name="planBenefits"
          defaultValue={subscribe.planBenefits.join("\n")}
          multiline
        />
        <Field
          label="FAQ（每行：問題|答案）"
          name="faq"
          defaultValue={subscribe.faq.map((f) => `${f.q}|${f.a}`).join("\n")}
          multiline
          tall
        />
      </div>
      <div className="admin-card">
        <h2>月訂</h2>
        <div className="admin-grid-2">
          <Field label="名稱" name="m_name" defaultValue={pricing.monthly.name} />
          <Field label="價格 NT$" name="m_price" type="number" defaultValue={pricing.monthly.price} />
          <Field label="週期" name="m_period" defaultValue={pricing.monthly.period} />
          <Field label="說明" name="m_blurb" defaultValue={pricing.monthly.blurb} />
        </div>
      </div>
      <div className="admin-card">
        <h2>年訂</h2>
        <div className="admin-grid-2">
          <Field label="名稱" name="y_name" defaultValue={pricing.yearly.name} />
          <Field label="價格 NT$" name="y_price" type="number" defaultValue={pricing.yearly.price} />
          <Field label="週期" name="y_period" defaultValue={pricing.yearly.period} />
          <Field label="徽章" name="y_badge" defaultValue={pricing.yearly.badge} />
        </div>
        <Field label="說明" name="y_blurb" defaultValue={pricing.yearly.blurb} />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
