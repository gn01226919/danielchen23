import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Daniel Chen · 23 Perspectives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 預設 OG 圖（深色科技調 · 品牌字） */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0b0d12 0%, #12151d 50%, #171b26 100%)",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#5eead4",
            letterSpacing: "0.08em",
          }}
        >
          23 PERSPECTIVES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            視角，給正在萌芽的你。
          </div>
          <div style={{ fontSize: 32, color: "#9ca3af", lineHeight: 1.4 }}>
            Daniel Chen · Mentor · Brand · AI · 現場
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#94a3b8",
            fontSize: 24,
          }}
        >
          <span>danielchen23.com</span>
          <span style={{ color: "#5eead4" }}>
            And now, it&apos;s time to be the mentor for you.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
