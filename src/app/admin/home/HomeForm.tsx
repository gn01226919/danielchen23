"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { PaperHomeLivePreview } from "@/components/admin/PaperHomeLivePreview";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveHomeAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

type Focus =
  | "hero"
  | "statement"
  | "featured"
  | "about"
  | "subscribe"
  | "collab"
  | null;

export function HomeForm({
  home,
  tagline,
  mentorEnglish,
}: {
  home: SiteContent["home"];
  tagline: string;
  mentorEnglish: string;
}) {
  const [values, setValues] = useState(home);
  const [focus, setFocus] = useState<Focus>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteContent["home"]>(
    key: K,
    value: SiteContent["home"][K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveHomeAction({
        ...values,
        subscribePoints: values.subscribePoints,
      });
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
            <h2>Hero</h2>
            <Field
              label="Eyebrow"
              name="heroEyebrow"
              value={values.heroEyebrow}
              onChange={(v) => set("heroEyebrow", v)}
              onFocus={() => setFocus("hero")}
              active={focus === "hero"}
            />
            <Field
              label="副標內文"
              name="heroBody"
              value={values.heroBody}
              onChange={(v) => set("heroBody", v)}
              onFocus={() => setFocus("hero")}
              active={focus === "hero"}
              multiline
              tall
            />
            <div className="admin-grid-2">
              <Field
                label="主 CTA"
                name="heroCtaPrimary"
                value={values.heroCtaPrimary}
                onChange={(v) => set("heroCtaPrimary", v)}
                onFocus={() => setFocus("hero")}
                active={focus === "hero"}
              />
              <Field
                label="次 CTA"
                name="heroCtaSecondary"
                value={values.heroCtaSecondary}
                onChange={(v) => set("heroCtaSecondary", v)}
                onFocus={() => setFocus("hero")}
                active={focus === "hero"}
              />
            </div>
            <Field
              label="右側影像文字"
              name="heroImageNote"
              value={values.heroImageNote}
              onChange={(v) => set("heroImageNote", v)}
              onFocus={() => setFocus("hero")}
              active={focus === "hero"}
              multiline
            />
          </div>

          <div className="admin-card">
            <h2>宣言</h2>
            <Field
              label="標題"
              name="statementTitle"
              value={values.statementTitle}
              onChange={(v) => set("statementTitle", v)}
              onFocus={() => setFocus("statement")}
              active={focus === "statement"}
            />
            <Field
              label="內文"
              name="statementBody"
              value={values.statementBody}
              onChange={(v) => set("statementBody", v)}
              onFocus={() => setFocus("statement")}
              active={focus === "statement"}
              multiline
              tall
            />
          </div>

          <div className="admin-card">
            <h2>精選 Perspectives</h2>
            <Field
              label="標題"
              name="featuredTitle"
              value={values.featuredTitle}
              onChange={(v) => set("featuredTitle", v)}
              onFocus={() => setFocus("featured")}
              active={focus === "featured"}
            />
            <Field
              label="副標"
              name="featuredSubtitle"
              value={values.featuredSubtitle}
              onChange={(v) => set("featuredSubtitle", v)}
              onFocus={() => setFocus("featured")}
              active={focus === "featured"}
            />
          </div>

          <div className="admin-card">
            <h2>About 短版</h2>
            <Field
              label="標題"
              name="aboutTitle"
              value={values.aboutTitle}
              onChange={(v) => set("aboutTitle", v)}
              onFocus={() => setFocus("about")}
              active={focus === "about"}
            />
            <Field
              label="內文"
              name="aboutBody"
              value={values.aboutBody}
              onChange={(v) => set("aboutBody", v)}
              onFocus={() => setFocus("about")}
              active={focus === "about"}
              multiline
              tall
            />
            <Field
              label="CTA"
              name="aboutCta"
              value={values.aboutCta}
              onChange={(v) => set("aboutCta", v)}
              onFocus={() => setFocus("about")}
              active={focus === "about"}
            />
          </div>

          <div className="admin-card">
            <h2>訂閱區塊</h2>
            <Field
              label="標題"
              name="subscribeTitle"
              value={values.subscribeTitle}
              onChange={(v) => set("subscribeTitle", v)}
              onFocus={() => setFocus("subscribe")}
              active={focus === "subscribe"}
            />
            <Field
              label="副標"
              name="subscribeSubtitle"
              value={values.subscribeSubtitle}
              onChange={(v) => set("subscribeSubtitle", v)}
              onFocus={() => setFocus("subscribe")}
              active={focus === "subscribe"}
            />
            <Field
              label="三點利益（一行一點）"
              name="subscribePoints"
              value={values.subscribePoints.join("\n")}
              onChange={(v) =>
                set(
                  "subscribePoints",
                  v
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
              onFocus={() => setFocus("subscribe")}
              active={focus === "subscribe"}
              multiline
            />
            <Field
              label="CTA"
              name="subscribeCta"
              value={values.subscribeCta}
              onChange={(v) => set("subscribeCta", v)}
              onFocus={() => setFocus("subscribe")}
              active={focus === "subscribe"}
            />
            <Field
              label="小字"
              name="subscribeNote"
              value={values.subscribeNote}
              onChange={(v) => set("subscribeNote", v)}
              onFocus={() => setFocus("subscribe")}
              active={focus === "subscribe"}
            />
          </div>

          <div className="admin-card">
            <h2>合作</h2>
            <Field
              label="標題"
              name="collabTitle"
              value={values.collabTitle}
              onChange={(v) => set("collabTitle", v)}
              onFocus={() => setFocus("collab")}
              active={focus === "collab"}
            />
            <Field
              label="內文"
              name="collabBody"
              value={values.collabBody}
              onChange={(v) => set("collabBody", v)}
              onFocus={() => setFocus("collab")}
              active={focus === "collab"}
              multiline
            />
            <Field
              label="CTA"
              name="collabCta"
              value={values.collabCta}
              onChange={(v) => set("collabCta", v)}
              onFocus={() => setFocus("collab")}
              active={focus === "collab"}
            />
          </div>

          <SaveBar saving={saving} message={msg} error={err} />
        </div>

        <LivePreviewPane
          title="首頁即時預覽"
          hint={focus ? `區塊：${focus}` : "點欄位看落點"}
        >
          <PaperHomeLivePreview
            home={values}
            tagline={tagline}
            mentorEnglish={mentorEnglish}
            focus={focus}
          />
        </LivePreviewPane>
      </div>
    </form>
  );
}
