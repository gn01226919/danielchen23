"use client";

import type { TechTheme } from "@/lib/cms/types";

type Focus =
  | keyof TechTheme
  | "hero"
  | "card"
  | "terminal"
  | null;

/** 科技站迷你即時預覽：focus 標示目前正在編的 token */
export function TechThemeLivePreview({
  theme,
  focus,
  tagline = "視角，給正在萌芽的你。",
  mentorEnglish = "And now, it's time to be the mentor for you.",
}: {
  theme: TechTheme;
  focus?: Focus;
  tagline?: string;
  mentorEnglish?: string;
}) {
  const hot = (key: Focus) =>
    focus === key ? "admin-preview-hot" : undefined;

  return (
    <div
      style={{
        background: theme.bg,
        color: theme.text,
        minHeight: 520,
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      {/* header */}
      <div
        className={hot("bgSoft")}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderBottom: `1px solid ${theme.dim}33`,
          background: `${theme.bg}ee`,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: theme.text, fontSize: 13 }}>
            Daniel Chen
          </div>
          <div
            className={hot("accent")}
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.accent,
              marginTop: 2,
            }}
          >
            23 · Perspectives
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: theme.muted, fontSize: 11 }}>About</span>
          <span
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
              color: "#041016",
              fontWeight: 600,
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: 5,
            }}
          >
            訂閱
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 16px 28px" }}>
        <div
          className={hot("accent")}
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 10,
          }}
        >
          // 23 = 萌芽 · Mentor
        </div>

        <div
          className={hot("heading")}
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: theme.heading,
            marginBottom: 10,
          }}
        >
          {tagline}
        </div>

        <div
          className={hot("text")}
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: theme.text,
            marginBottom: 8,
            maxWidth: 360,
          }}
        >
          內文 text — 純白可讀。這段會跟著「內文 text」變色。
        </div>

        <div
          className={hot("muted")}
          style={{
            fontSize: 12,
            lineHeight: 1.55,
            color: theme.muted,
            marginBottom: 10,
            maxWidth: 360,
          }}
        >
          次要段落 muted — 說明、副標、卡片摘要落在這裡。
        </div>

        <div
          className={hot("accent2")}
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            color: theme.accent2,
            borderLeft: `2px solid ${theme.accent2}99`,
            paddingLeft: 10,
            marginBottom: 16,
          }}
        >
          {mentorEnglish}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 12,
          }}
        >
          <div>
            <div
              className={hot("heading")}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: theme.heading,
                marginBottom: 8,
              }}
            >
              H2 區塊標題
            </div>
            <div
              className={hot("card")}
              style={{
                background: theme.bgElev,
                border: `1px solid ${theme.dim}40`,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                className={hot("accent")}
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  color: theme.accent,
                  marginBottom: 6,
                }}
              >
                01 / field
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: theme.heading,
                  marginBottom: 4,
                  fontSize: 13,
                }}
              >
                卡片標題 h3
              </div>
              <div style={{ color: theme.muted, fontSize: 12 }}>
                卡片內文用 muted。
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <span
                  className={hot("dim")}
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 9,
                    border: `1px solid ${theme.dim}55`,
                    color: theme.dim,
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  chip dim
                </span>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 9,
                    border: `1px solid ${theme.accent}66`,
                    color: theme.accent,
                    background: `${theme.accent}18`,
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  members
                </span>
              </div>
            </div>
          </div>

          <div
            className={hot("terminal")}
            style={{
              background: theme.bgElev,
              border: `1px solid ${theme.dim}40`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: theme.bgSoft,
                padding: "6px 10px",
                borderBottom: `1px solid ${theme.dim}33`,
                fontFamily: "ui-monospace, monospace",
                fontSize: 9,
                color: theme.comment,
              }}
            >
              mentor.session — zsh
            </div>
            <div
              style={{
                padding: 10,
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                lineHeight: 1.7,
              }}
            >
              <div>
                <span className={hot("comment")} style={{ color: theme.comment }}>
                  $
                </span>{" "}
                <span className={hot("accent")} style={{ color: theme.accent }}>
                  whoami
                </span>
              </div>
              <div className={hot("string")} style={{ color: theme.string }}>
                Daniel Chen · mentor
              </div>
              <div>
                <span style={{ color: theme.comment }}>$</span>{" "}
                <span style={{ color: theme.accent }}>echo $MANTRA</span>
              </div>
              <div className={hot("accent2")} style={{ color: theme.accent2 }}>
                {mentorEnglish.slice(0, 28)}…
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 10,
            fontFamily: "ui-monospace, monospace",
            color: theme.dim,
          }}
        >
          {focus
            ? `→ 正在編輯：${String(focus)}（綠框標示落點）`
            : "點左側欄位 → 這裡會框出對應位置"}
        </div>
      </div>
    </div>
  );
}
