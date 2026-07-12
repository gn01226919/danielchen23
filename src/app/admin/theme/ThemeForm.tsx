"use client";

import { useState } from "react";
import { LivePreviewPane } from "@/components/admin/LivePreviewPane";
import { TechThemeLivePreview } from "@/components/admin/TechThemeLivePreview";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveThemeTechAction } from "@/lib/cms/actions";
import type { TechTheme } from "@/lib/cms/types";

const fields: {
  key: keyof Omit<TechTheme, "customCss">;
  label: string;
  hint: string;
  focus: keyof TechTheme | "card" | "terminal";
}[] = [
  { key: "bg", label: "背景 bg", hint: "整頁底", focus: "bg" },
  { key: "bgElev", label: "卡片底 bgElev", hint: "面板／卡片", focus: "card" },
  { key: "bgSoft", label: "輸入框底 bgSoft", hint: "表單／標題列", focus: "bgSoft" },
  { key: "text", label: "內文 text", hint: "建議 #ffffff", focus: "text" },
  { key: "heading", label: "H1／H2 heading", hint: "建議淺灰", focus: "heading" },
  { key: "muted", label: "次要內文 muted", hint: "段落輔助", focus: "muted" },
  { key: "dim", label: "更淡 dim", hint: "meta／chip", focus: "dim" },
  { key: "accent", label: "強調 accent", hint: "kicker", focus: "accent" },
  { key: "accent2", label: "強調 2 accent2", hint: "quote", focus: "accent2" },
  { key: "string", label: "字串 string", hint: "終端輸出", focus: "string" },
  { key: "comment", label: "註解 comment", hint: "終端 dim", focus: "comment" },
];

export function ThemeForm({ theme }: { theme: TechTheme }) {
  const [values, setValues] = useState<TechTheme>(theme);
  const [focus, setFocus] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setColor(key: keyof TechTheme, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await saveThemeTechAction(values);
      setMsg("已儲存 · 右側為未儲存即時預覽；正式站已更新");
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
            <h2>顏色（點欄位 → 右側綠框標示落點）</h2>
            <div className="admin-grid-2">
              {fields.map((f) => (
                <div
                  className={`admin-field${focus === f.focus ? " admin-field-active" : ""}`}
                  key={f.key}
                >
                  <label htmlFor={f.key}>
                    {f.label}
                    <span style={{ opacity: 0.6 }}> · {f.hint}</span>
                  </label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={normalizeColor(values[f.key])}
                      onChange={(e) => setColor(f.key, e.target.value)}
                      onFocus={() => setFocus(f.focus)}
                      style={{
                        width: 44,
                        height: 38,
                        padding: 2,
                        border: "1px solid var(--admin-border)",
                        background: "var(--admin-input)",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      aria-label={f.label}
                    />
                    <input
                      id={f.key}
                      value={values[f.key]}
                      onChange={(e) => setColor(f.key, e.target.value)}
                      onFocus={() => setFocus(f.focus)}
                      style={{ flex: 1 }}
                      spellCheck={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h2>自訂 CSS（進階 · 即時注入預覽）</h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--admin-muted)",
                margin: "0 0 0.75rem",
              }}
            >
              例：<code>--t-heading: #b0b0b0;</code> 或{" "}
              <code>.tech-card &#123; border-radius: 0; &#125;</code>
            </p>
            <div className="admin-field">
              <label htmlFor="customCss">customCss</label>
              <textarea
                id="customCss"
                className="tall"
                value={values.customCss}
                onChange={(e) => setColor("customCss", e.target.value)}
                onFocus={() => setFocus("customCss")}
                spellCheck={false}
                style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}
              />
            </div>
          </div>

          <div className="admin-actions">
            <a
              href="/v/tech"
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-ghost"
            >
              開正式科技站 ↗
            </a>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() =>
                setValues({
                  bg: "#0b0d12",
                  bgElev: "#12151d",
                  bgSoft: "#171b26",
                  text: "#ffffff",
                  heading: "#9ca3af",
                  muted: "#d1d5db",
                  dim: "#9ca3af",
                  accent: "#5eead4",
                  accent2: "#7dd3fc",
                  string: "#86efac",
                  comment: "#94a3b8",
                  customCss: values.customCss,
                })
              }
            >
              重設預設色
            </button>
          </div>
          <SaveBar saving={saving} message={msg} error={err} />
        </div>

        <LivePreviewPane
          title="科技站即時預覽"
          hint={focus ? `聚焦：${focus}` : "點左側欄位看落點"}
        >
          <TechThemeLivePreview
            theme={values}
            focus={focus as Parameters<typeof TechThemeLivePreview>[0]["focus"]}
          />
        </LivePreviewPane>
      </div>
    </form>
  );
}

function normalizeColor(hex: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#9ca3af";
}
