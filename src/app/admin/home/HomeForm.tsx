"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveHomeAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

function lines(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function HomeForm({ home }: { home: SiteContent["home"] }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveHomeAction({
        heroEyebrow: String(fd.get("heroEyebrow") || ""),
        heroBody: String(fd.get("heroBody") || ""),
        heroCtaPrimary: String(fd.get("heroCtaPrimary") || ""),
        heroCtaSecondary: String(fd.get("heroCtaSecondary") || ""),
        heroImageNote: String(fd.get("heroImageNote") || ""),
        statementTitle: String(fd.get("statementTitle") || ""),
        statementBody: String(fd.get("statementBody") || ""),
        featuredTitle: String(fd.get("featuredTitle") || ""),
        featuredSubtitle: String(fd.get("featuredSubtitle") || ""),
        aboutTitle: String(fd.get("aboutTitle") || ""),
        aboutBody: String(fd.get("aboutBody") || ""),
        aboutCta: String(fd.get("aboutCta") || ""),
        subscribeTitle: String(fd.get("subscribeTitle") || ""),
        subscribeSubtitle: String(fd.get("subscribeSubtitle") || ""),
        subscribePoints: lines(String(fd.get("subscribePoints") || "")),
        subscribeCta: String(fd.get("subscribeCta") || ""),
        subscribeNote: String(fd.get("subscribeNote") || ""),
        collabTitle: String(fd.get("collabTitle") || ""),
        collabBody: String(fd.get("collabBody") || ""),
        collabCta: String(fd.get("collabCta") || ""),
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
        <h2>Hero</h2>
        <Field label="Eyebrow" name="heroEyebrow" defaultValue={home.heroEyebrow} />
        <Field label="副標內文" name="heroBody" defaultValue={home.heroBody} multiline tall />
        <div className="admin-grid-2">
          <Field label="主 CTA" name="heroCtaPrimary" defaultValue={home.heroCtaPrimary} />
          <Field label="次 CTA" name="heroCtaSecondary" defaultValue={home.heroCtaSecondary} />
        </div>
        <Field label="右側影像文字" name="heroImageNote" defaultValue={home.heroImageNote} multiline />
      </div>
      <div className="admin-card">
        <h2>宣言</h2>
        <Field label="標題" name="statementTitle" defaultValue={home.statementTitle} />
        <Field label="內文" name="statementBody" defaultValue={home.statementBody} multiline tall />
      </div>
      <div className="admin-card">
        <h2>精選 Perspectives</h2>
        <Field label="標題" name="featuredTitle" defaultValue={home.featuredTitle} />
        <Field label="副標" name="featuredSubtitle" defaultValue={home.featuredSubtitle} />
      </div>
      <div className="admin-card">
        <h2>About 短版</h2>
        <Field label="標題" name="aboutTitle" defaultValue={home.aboutTitle} />
        <Field label="內文" name="aboutBody" defaultValue={home.aboutBody} multiline tall />
        <Field label="CTA" name="aboutCta" defaultValue={home.aboutCta} />
      </div>
      <div className="admin-card">
        <h2>訂閱區塊</h2>
        <Field label="標題" name="subscribeTitle" defaultValue={home.subscribeTitle} />
        <Field label="副標" name="subscribeSubtitle" defaultValue={home.subscribeSubtitle} />
        <Field
          label="三點利益（一行一點）"
          name="subscribePoints"
          defaultValue={home.subscribePoints.join("\n")}
          multiline
        />
        <Field label="CTA" name="subscribeCta" defaultValue={home.subscribeCta} />
        <Field label="小字" name="subscribeNote" defaultValue={home.subscribeNote} />
      </div>
      <div className="admin-card">
        <h2>合作</h2>
        <Field label="標題" name="collabTitle" defaultValue={home.collabTitle} />
        <Field label="內文" name="collabBody" defaultValue={home.collabBody} multiline />
        <Field label="CTA" name="collabCta" defaultValue={home.collabCta} />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
