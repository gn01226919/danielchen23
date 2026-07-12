"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveSettingsAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

export function SettingsForm({
  settings,
}: {
  settings: SiteContent["settings"];
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveSettingsAction({
        siteName: String(fd.get("siteName") || ""),
        product: String(fd.get("product") || ""),
        domain: String(fd.get("domain") || ""),
        tagline: String(fd.get("tagline") || ""),
        footerLine: String(fd.get("footerLine") || ""),
        mentorTagline: String(fd.get("mentorTagline") || ""),
        mentorEnglish: String(fd.get("mentorEnglish") || ""),
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
        <h2>品牌</h2>
        <Field label="站名" name="siteName" defaultValue={settings.siteName} />
        <Field label="產品名" name="product" defaultValue={settings.product} />
        <Field label="網域" name="domain" defaultValue={settings.domain} />
        <Field label="主標語（H1）" name="tagline" defaultValue={settings.tagline} />
        <Field
          label="Mentor 短標（中）"
          name="mentorTagline"
          defaultValue={settings.mentorTagline}
          hint="例：Mentor，引領前路"
        />
        <Field
          label="Mentor 金句（英）"
          name="mentorEnglish"
          defaultValue={settings.mentorEnglish}
          hint="And now, it's time to be the mentor for you."
        />
        <Field
          label="頁尾一句"
          name="footerLine"
          defaultValue={settings.footerLine}
          multiline
        />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
