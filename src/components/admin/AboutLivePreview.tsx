"use client";

import type { SiteContent } from "@/lib/cms/types";

type Focus = "header" | "mentor" | "what" | "why" | null;

export function AboutLivePreview({
  about,
  mentorEnglish,
  focus,
}: {
  about: SiteContent["about"];
  mentorEnglish: string;
  focus: Focus;
}) {
  const hot = (s: Focus) => (focus === s ? "admin-preview-hot" : undefined);

  return (
    <div
      style={{
        background: "#f7f4ef",
        color: "#1c1b19",
        minHeight: 520,
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      <div
        className={hot("header")}
        style={{ padding: "22px 16px", borderBottom: "1px solid #e0dad0" }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7a756c",
          }}
        >
          {about.eyebrow}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 22,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          {about.title}
        </div>
        <div style={{ color: "#7a756c", marginTop: 10, lineHeight: 1.55 }}>
          {about.lead}
        </div>
      </div>

      <div
        style={{
          height: 80,
          background: "linear-gradient(160deg,#f0ebe3,#6a5e52)",
        }}
      />

      <div style={{ padding: "18px 16px 24px" }}>
        <div className={hot("mentor")} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18 }}>
            {about.mentorTitle}
          </div>
          {about.mentorParagraphs.map((p) => (
            <p
              key={p.slice(0, 30)}
              style={{
                margin: "10px 0 0",
                color: p === mentorEnglish ? "#1c1b19" : "#7a756c",
                fontStyle: p === mentorEnglish ? "italic" : "normal",
                fontFamily:
                  p === mentorEnglish ? "Georgia, serif" : "inherit",
                lineHeight: 1.55,
                fontSize: p === mentorEnglish ? 14 : 12.5,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <div className={hot("what")} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>
            {about.whatTitle}
          </div>
          <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
            {about.whatItems.map((item) => (
              <li
                key={item}
                style={{
                  borderBottom: "1px solid #e0dad0",
                  padding: "7px 0",
                  color: "#3f3c37",
                  fontSize: 12.5,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={hot("why")}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>
            {about.whyTitle}
          </div>
          {about.whyParagraphs.map((p) => (
            <p
              key={p.slice(0, 30)}
              style={{
                margin: "10px 0 0",
                color: "#7a756c",
                lineHeight: 1.55,
                fontSize: 12.5,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 10,
            color: "#7a756c",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {focus ? `→ 區塊：${focus}` : "點左側欄位 → 綠框落點"}
        </div>
      </div>
    </div>
  );
}
