"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveWorkAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

export function WorkAdminForm({ work }: { work: SiteContent["work"] }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const offers = work.offers.map((o, i) => ({
        title: String(fd.get(`offer_title_${i}`) || o.title),
        body: String(fd.get(`offer_body_${i}`) || o.body),
      }));
      await saveWorkAction({
        title: String(fd.get("title") || ""),
        lead: String(fd.get("lead") || ""),
        offers,
        formTitle: String(fd.get("formTitle") || ""),
        formNote: String(fd.get("formNote") || ""),
        formFooter: String(fd.get("formFooter") || ""),
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
        <Field label="大標" name="title" defaultValue={work.title} />
        <Field label="導語" name="lead" defaultValue={work.lead} multiline tall />
      </div>
      {work.offers.map((o, i) => (
        <div className="admin-card" key={o.title}>
          <h2>服務 {i + 1}</h2>
          <Field label="標題" name={`offer_title_${i}`} defaultValue={o.title} />
          <Field label="說明" name={`offer_body_${i}`} defaultValue={o.body} multiline />
        </div>
      ))}
      <div className="admin-card">
        <h2>表單區</h2>
        <Field label="標題" name="formTitle" defaultValue={work.formTitle} />
        <Field label="說明" name="formNote" defaultValue={work.formNote} />
        <Field label="底部提示" name="formFooter" defaultValue={work.formFooter} multiline />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
