"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveFramesAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

const tones = ["warm", "earth", "cool", "ink"] as const;

export function FramesForm({
  frames,
}: {
  frames: SiteContent["narrativeFrames"];
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(fd: FormData) {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const next = frames.map((f, i) => ({
        id: f.id,
        caption: String(fd.get(`caption_${i}`) || ""),
        tone: (String(fd.get(`tone_${i}`) || f.tone) as (typeof tones)[number]),
      }));
      await saveFramesAction(next);
      setMsg("已儲存");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={onSubmit}>
      {frames.map((f, i) => (
        <div className="admin-card" key={f.id}>
          <h2>幀 {String(i + 1).padStart(2, "0")}</h2>
          <Field
            label="圖說"
            name={`caption_${i}`}
            defaultValue={f.caption}
          />
          <div className="admin-field">
            <label htmlFor={`tone_${i}`}>色調</label>
            <select id={`tone_${i}`} name={`tone_${i}`} defaultValue={f.tone}>
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <SaveBar saving={saving} message={msg} error={err} />
    </form>
  );
}
