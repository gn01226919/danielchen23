"use client";

import { useState } from "react";
import { AboutLivePreview } from "@/components/admin/AboutLivePreview";
import { Field } from "@/components/admin/Field";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveAboutAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

type Focus = "header" | "mentor" | "what" | "why" | null;

export function AboutForm({
  about,
  mentorEnglish,
}: {
  about: SiteContent["about"];
  mentorEnglish: string;
}) {
  const [values, setValues] = useState(about);
  const [focus, setFocus] = useState<Focus>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteContent["about"]>(
    key: K,
    value: SiteContent["about"][K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveAboutAction(values);
      setMsg("已儲存");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-split">
        <div className="admin-split__form">
          <div className="admin-card">
            <h2>頁首</h2>
            <Field
              label="Eyebrow"
              name="eyebrow"
              value={values.eyebrow}
              onChange={(v) => set("eyebrow", v)}
              onFocus={() => setFocus("header")}
              active={focus === "header"}
            />
            <Field
              label="大標"
              name="title"
              value={values.title}
              onChange={(v) => set("title", v)}
              onFocus={() => setFocus("header")}
              active={focus === "header"}
            />
            <Field
              label="導語"
              name="lead"
              value={values.lead}
              onChange={(v) => set("lead", v)}
              onFocus={() => setFocus("header")}
              active={focus === "header"}
              multiline
            />
          </div>
          <div className="admin-card">
            <h2>Mentor 區塊</h2>
            <Field
              label="區塊標題"
              name="mentorTitle"
              value={values.mentorTitle}
              onChange={(v) => set("mentorTitle", v)}
              onFocus={() => setFocus("mentor")}
              active={focus === "mentor"}
            />
            <Field
              label="段落（一行一段）"
              name="mentorParagraphs"
              value={values.mentorParagraphs.join("\n")}
              onChange={(v) =>
                set(
                  "mentorParagraphs",
                  v
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
              onFocus={() => setFocus("mentor")}
              active={focus === "mentor"}
              multiline
              tall
              hint="英文金句單獨一行會斜體"
            />
          </div>
          <div className="admin-card">
            <h2>我做什麼</h2>
            <Field
              label="標題"
              name="whatTitle"
              value={values.whatTitle}
              onChange={(v) => set("whatTitle", v)}
              onFocus={() => setFocus("what")}
              active={focus === "what"}
            />
            <Field
              label="項目（一行一項）"
              name="whatItems"
              value={values.whatItems.join("\n")}
              onChange={(v) =>
                set(
                  "whatItems",
                  v
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
              onFocus={() => setFocus("what")}
              active={focus === "what"}
              multiline
            />
          </div>
          <div className="admin-card">
            <h2>為什麼有這個站</h2>
            <Field
              label="標題"
              name="whyTitle"
              value={values.whyTitle}
              onChange={(v) => set("whyTitle", v)}
              onFocus={() => setFocus("why")}
              active={focus === "why"}
            />
            <Field
              label="段落（一行一段）"
              name="whyParagraphs"
              value={values.whyParagraphs.join("\n")}
              onChange={(v) =>
                set(
                  "whyParagraphs",
                  v
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
              onFocus={() => setFocus("why")}
              active={focus === "why"}
              multiline
              tall
            />
          </div>
          <SaveBar saving={saving} message={msg} error={err} />
        </div>

        <LivePreviewPane
          title="About 即時預覽"
          hint={focus ? `區塊：${focus}` : "點欄位看落點"}
        >
          <AboutLivePreview
            about={values}
            mentorEnglish={mentorEnglish}
            focus={focus}
          />
        </LivePreviewPane>
      </div>
    </form>
  );
}
