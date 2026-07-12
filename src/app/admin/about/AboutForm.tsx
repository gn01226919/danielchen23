"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveAboutAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

function lines(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function AboutForm({ about }: { about: SiteContent["about"] }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveAboutAction({
        eyebrow: String(fd.get("eyebrow") || ""),
        title: String(fd.get("title") || ""),
        lead: String(fd.get("lead") || ""),
        mentorTitle: String(fd.get("mentorTitle") || ""),
        mentorParagraphs: lines(String(fd.get("mentorParagraphs") || "")),
        whatTitle: String(fd.get("whatTitle") || ""),
        whatItems: lines(String(fd.get("whatItems") || "")),
        whyTitle: String(fd.get("whyTitle") || ""),
        whyParagraphs: lines(String(fd.get("whyParagraphs") || "")),
      });
      setMsg("已儲存 · 請開前台 /about 確認");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={onSubmit}>
      <div className="admin-card">
        <h2>頁首</h2>
        <Field label="Eyebrow" name="eyebrow" defaultValue={about.eyebrow} />
        <Field label="大標" name="title" defaultValue={about.title} />
        <Field label="導語" name="lead" defaultValue={about.lead} multiline />
      </div>
      <div className="admin-card">
        <h2>Mentor 區塊</h2>
        <Field
          label="區塊標題"
          name="mentorTitle"
          defaultValue={about.mentorTitle}
        />
        <Field
          label="段落（一行一段）"
          name="mentorParagraphs"
          defaultValue={about.mentorParagraphs.join("\n")}
          multiline
          tall
          hint="英文金句單獨成一行會以斜體顯示"
        />
      </div>
      <div className="admin-card">
        <h2>我做什麼</h2>
        <Field label="標題" name="whatTitle" defaultValue={about.whatTitle} />
        <Field
          label="項目（一行一項）"
          name="whatItems"
          defaultValue={about.whatItems.join("\n")}
          multiline
        />
      </div>
      <div className="admin-card">
        <h2>為什麼有這個站</h2>
        <Field label="標題" name="whyTitle" defaultValue={about.whyTitle} />
        <Field
          label="段落（一行一段）"
          name="whyParagraphs"
          defaultValue={about.whyParagraphs.join("\n")}
          multiline
          tall
        />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
