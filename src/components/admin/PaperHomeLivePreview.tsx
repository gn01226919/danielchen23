"use client";

import type { SiteContent } from "@/lib/cms/types";

type Section =
  | "hero"
  | "statement"
  | "featured"
  | "about"
  | "subscribe"
  | "collab"
  | null;

export function PaperHomeLivePreview({
  home,
  tagline,
  mentorEnglish,
  focus,
}: {
  home: SiteContent["home"];
  tagline: string;
  mentorEnglish: string;
  focus: Section;
}) {
  const hot = (s: Section) => (focus === s ? "admin-preview-hot" : undefined);

  return (
    <div
      style={{
        background: "#f7f4ef",
        color: "#1c1b19",
        minHeight: 560,
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #e0dad0",
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(247,244,239,0.95)",
        }}
      >
        <strong style={{ fontFamily: "Georgia, serif", fontSize: 14 }}>
          Daniel Chen
        </strong>
        <span style={{ fontSize: 11, color: "#7a756c" }}>預覽 · 首頁</span>
      </div>

      <div
        className={hot("hero")}
        style={{
          padding: "22px 16px",
          borderBottom: "1px solid #e0dad0",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7a756c",
            marginBottom: 8,
          }}
        >
          {home.heroEyebrow || "eyebrow"}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            lineHeight: 1.15,
            marginBottom: 10,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            color: "#7a756c",
            whiteSpace: "pre-line",
            lineHeight: 1.55,
            marginBottom: 8,
          }}
        >
          {home.heroBody || "副標…"}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: "#3f3c37",
            marginBottom: 12,
          }}
        >
          {mentorEnglish}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              background: "#1c1b19",
              color: "#f7f4ef",
              padding: "6px 10px",
              fontSize: 11,
            }}
          >
            {home.heroCtaPrimary || "主 CTA"}
          </span>
          <span
            style={{
              border: "1px solid #cfc6b8",
              padding: "6px 10px",
              fontSize: 11,
            }}
          >
            {home.heroCtaSecondary || "次 CTA"}
          </span>
        </div>
        <div
          style={{
            marginTop: 12,
            height: 72,
            background: "linear-gradient(145deg,#e8e2d6,#6e5846)",
            display: "flex",
            alignItems: "flex-end",
            padding: 10,
            color: "#f7f4ef",
            fontFamily: "Georgia, serif",
            whiteSpace: "pre-line",
            fontSize: 13,
          }}
        >
          {home.heroImageNote || "影像字"}
        </div>
      </div>

      <div
        className={hot("statement")}
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid #e0dad0",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, marginBottom: 8 }}>
          {home.statementTitle || "宣言標題"}
        </div>
        <div
          style={{
            color: "#7a756c",
            whiteSpace: "pre-line",
            lineHeight: 1.55,
            fontSize: 12,
          }}
        >
          {home.statementBody || "宣言內文"}
        </div>
      </div>

      <div
        className={hot("featured")}
        style={{ padding: "16px", borderBottom: "1px solid #e0dad0" }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16 }}>
          {home.featuredTitle || "精選"}
        </div>
        <div style={{ color: "#7a756c", fontSize: 12, marginTop: 4 }}>
          {home.featuredSubtitle || "副標"}
        </div>
        <div
          style={{
            marginTop: 10,
            height: 48,
            border: "1px solid #e0dad0",
            background: "#fffcf7",
            fontSize: 11,
            color: "#7a756c",
            display: "grid",
            placeItems: "center",
          }}
        >
          文章卡片區
        </div>
      </div>

      <div
        className={hot("about")}
        style={{ padding: "16px", borderBottom: "1px solid #e0dad0" }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16 }}>
          {home.aboutTitle || "About"}
        </div>
        <div
          style={{
            color: "#7a756c",
            fontSize: 12,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {(home.aboutBody || "關於…").slice(0, 120)}
          {(home.aboutBody?.length || 0) > 120 ? "…" : ""}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, textDecoration: "underline" }}>
          {home.aboutCta || "CTA"}
        </div>
      </div>

      <div
        className={hot("subscribe")}
        style={{
          padding: "16px",
          borderBottom: "1px solid #e0dad0",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16 }}>
          {home.subscribeTitle || "訂閱"}
        </div>
        <div style={{ color: "#7a756c", fontSize: 12, marginTop: 4 }}>
          {home.subscribeSubtitle || ""}
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "10px auto 0",
            maxWidth: 280,
            textAlign: "left",
            fontSize: 11,
            color: "#3f3c37",
          }}
        >
          {(home.subscribePoints?.length
            ? home.subscribePoints
            : ["利益 1", "利益 2"]
          ).map((p) => (
            <li
              key={p}
              style={{
                borderBottom: "1px solid #e0dad0",
                padding: "6px 0",
              }}
            >
              {p}
            </li>
          ))}
        </ul>
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            background: "#1c1b19",
            color: "#f7f4ef",
            padding: "6px 12px",
            fontSize: 11,
          }}
        >
          {home.subscribeCta || "CTA"}
        </div>
        <div style={{ fontSize: 10, color: "#7a756c", marginTop: 6 }}>
          {home.subscribeNote || ""}
        </div>
      </div>

      <div className={hot("collab")} style={{ padding: "16px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15 }}>
          {home.collabTitle || "合作"}
        </div>
        <div style={{ color: "#7a756c", fontSize: 12, marginTop: 6 }}>
          {(home.collabBody || "").slice(0, 100)}
          {(home.collabBody?.length || 0) > 100 ? "…" : ""}
        </div>
        <div
          style={{
            marginTop: 8,
            display: "inline-block",
            border: "1px solid #cfc6b8",
            padding: "5px 10px",
            fontSize: 11,
          }}
        >
          {home.collabCta || "CTA"}
        </div>
      </div>

      <div
        style={{
          padding: "8px 14px 14px",
          fontSize: 10,
          color: "#7a756c",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {focus
          ? `→ 正在編輯區塊：${focus}`
          : "點左側欄位 → 綠框標示對應首頁區塊"}
      </div>
    </div>
  );
}
