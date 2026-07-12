"use client";

import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveSettingsAction } from "@/lib/cms/actions";
import type { SiteContent } from "@/lib/cms/types";

type Focus =
  | "siteName"
  | "tagline"
  | "mentor"
  | "english"
  | "footer"
  | null;

export function SettingsForm({
  settings,
}: {
  settings: SiteContent["settings"];
}) {
  const [values, setValues] = useState(settings);
  const [focus, setFocus] = useState<Focus>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteContent["settings"]>(
    key: K,
    value: SiteContent["settings"][K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveSettingsAction(values);
      setMsg("已儲存");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  const hot = (k: Focus) => (focus === k ? "admin-preview-hot" : undefined);

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-split">
        <div className="admin-split__form">
          <div className="admin-card">
            <h2>品牌</h2>
            <Field
              label="站名"
              name="siteName"
              value={values.siteName}
              onChange={(v) => set("siteName", v)}
              onFocus={() => setFocus("siteName")}
              active={focus === "siteName"}
            />
            <Field
              label="產品名"
              name="product"
              value={values.product}
              onChange={(v) => set("product", v)}
              onFocus={() => setFocus("siteName")}
              active={focus === "siteName"}
            />
            <Field
              label="網域"
              name="domain"
              value={values.domain}
              onChange={(v) => set("domain", v)}
              onFocus={() => setFocus("footer")}
              active={focus === "footer"}
            />
            <Field
              label="主標語（H1）"
              name="tagline"
              value={values.tagline}
              onChange={(v) => set("tagline", v)}
              onFocus={() => setFocus("tagline")}
              active={focus === "tagline"}
            />
            <Field
              label="Mentor 短標（中）"
              name="mentorTagline"
              value={values.mentorTagline}
              onChange={(v) => set("mentorTagline", v)}
              onFocus={() => setFocus("mentor")}
              active={focus === "mentor"}
            />
            <Field
              label="Mentor 金句（英）"
              name="mentorEnglish"
              value={values.mentorEnglish}
              onChange={(v) => set("mentorEnglish", v)}
              onFocus={() => setFocus("english")}
              active={focus === "english"}
            />
            <Field
              label="頁尾一句"
              name="footerLine"
              value={values.footerLine}
              onChange={(v) => set("footerLine", v)}
              onFocus={() => setFocus("footer")}
              active={focus === "footer"}
              multiline
            />
          </div>
          <SaveBar saving={saving} message={msg} error={err} />
        </div>

        <LivePreviewPane
          title="全站設定預覽"
          hint={focus ? `聚焦：${focus}` : "點欄位看落點"}
        >
          <div
            style={{
              background: "#f7f4ef",
              color: "#1c1b19",
              minHeight: 420,
              fontFamily: "system-ui, sans-serif",
              fontSize: 13,
            }}
          >
            <div
              className={hot("siteName")}
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid #e0dad0",
              }}
            >
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16 }}>
                {values.siteName}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7a756c",
                  marginTop: 3,
                }}
              >
                23 · {values.product}
              </div>
            </div>
            <div style={{ padding: "20px 16px" }}>
              <div
                className={hot("tagline")}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 24,
                  lineHeight: 1.15,
                }}
              >
                {values.tagline}
              </div>
              <div
                className={hot("mentor")}
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: "#5c4a3a",
                }}
              >
                {values.mentorTagline}
              </div>
              <div
                className={hot("english")}
                style={{
                  marginTop: 10,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                {values.mentorEnglish}
              </div>
            </div>
            <div
              className={hot("footer")}
              style={{
                marginTop: 24,
                borderTop: "1px solid #e0dad0",
                padding: "14px 16px",
                fontSize: 11,
                color: "#7a756c",
              }}
            >
              <div>{values.footerLine}</div>
              <div style={{ marginTop: 6 }}>
                © {values.siteName} · {values.domain}
              </div>
            </div>
          </div>
        </LivePreviewPane>
      </div>
    </form>
  );
}
