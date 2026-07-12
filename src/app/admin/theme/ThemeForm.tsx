"use client";

import { useState } from "react";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveThemeTechAction } from "@/lib/cms/actions";
import type { TechTheme } from "@/lib/cms/types";

const fields: {
  key: keyof Omit<TechTheme, "customCss">;
  label: string;
  hint: string;
}[] = [
  { key: "bg", label: "背景 bg", hint: "整頁底" },
  { key: "bgElev", label: "卡片底 bgElev", hint: "面板／卡片" },
  { key: "bgSoft", label: "輸入框底 bgSoft", hint: "表單欄位" },
  { key: "text", label: "內文 text", hint: "建議 #ffffff 純白" },
  { key: "heading", label: "H1／H2 heading", hint: "建議淺灰 #9ca3af" },
  { key: "muted", label: "次要內文 muted", hint: "段落輔助" },
  { key: "dim", label: "更淡 dim", hint: "meta／註解" },
  { key: "accent", label: "強調 accent", hint: "kicker／連結感" },
  { key: "accent2", label: "強調 2 accent2", hint: "sky／quote" },
  { key: "string", label: "程式字串 string", hint: "終端機輸出" },
  { key: "comment", label: "註解 comment", hint: "終端機 dim" },
];

export function ThemeForm({ theme }: { theme: TechTheme }) {
  const [values, setValues] = useState<TechTheme>(theme);
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
      setMsg("已儲存 · 請開 /v/tech 重新整理");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card">
        <h2>即時預覽（縮圖）</h2>
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid var(--admin-border)",
            background: values.bg,
            padding: "1.25rem",
            color: values.text,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-figtree), system-ui",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: values.accent,
              marginBottom: 8,
            }}
          >
            // preview
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: values.heading,
              marginBottom: 8,
            }}
          >
            H1 標題（heading）
          </div>
          <div style={{ fontSize: 16, color: values.heading, marginBottom: 10 }}>
            H2 次標（heading）
          </div>
          <div style={{ fontSize: 14, color: values.text, lineHeight: 1.6 }}>
            內文 text — 可用純白。次要{" "}
            <span style={{ color: values.muted }}>muted</span> ·{" "}
            <span style={{ color: values.dim }}>dim</span>
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              color: values.comment,
            }}
          >
            <span style={{ color: values.accent }}>$</span>{" "}
            <span style={{ color: values.string }}>echo hello</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>顏色</h2>
        <div className="admin-grid-2">
          {fields.map((f) => (
            <div className="admin-field" key={f.key}>
              <label htmlFor={f.key}>
                {f.label}
                <span style={{ opacity: 0.6 }}> · {f.hint}</span>
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={normalizeColor(values[f.key])}
                  onChange={(e) => setColor(f.key, e.target.value)}
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
                  style={{ flex: 1 }}
                  spellCheck={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>自訂 CSS（進階）</h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--admin-muted)",
            margin: "0 0 0.75rem",
          }}
        >
          會包在 <code>.tech-root &#123; … &#125;</code> 內。可覆寫變數或加樣式。
          例：
          <code style={{ display: "block", marginTop: 6 }}>
            --t-heading: #b0b0b0; /* 或 */ .tech-card &#123; border-radius: 0; &#125;
          </code>
        </p>
        <div className="admin-field">
          <label htmlFor="customCss">customCss</label>
          <textarea
            id="customCss"
            className="tall"
            value={values.customCss}
            onChange={(e) => setColor("customCss", e.target.value)}
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
          開科技站 ↗
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
          重設預設色（保留 CSS）
        </button>
      </div>

      <SaveBar saving={saving} message={msg} error={err} />
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
