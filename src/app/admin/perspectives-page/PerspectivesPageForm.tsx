"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { savePerspectivesPageAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

export function PerspectivesPageForm({
  perspectives,
}: {
  perspectives: SiteContent["perspectives"];
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await savePerspectivesPageAction({
        title: String(fd.get("title") || ""),
        lead: String(fd.get("lead") || ""),
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
        <Field label="標題" name="title" defaultValue={perspectives.title} />
        <Field label="導語" name="lead" defaultValue={perspectives.lead} multiline />
      </div>
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
