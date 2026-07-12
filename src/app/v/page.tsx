import Link from "next/link";

const previews = [
  {
    href: "/",
    code: "Main",
    name: "科技感（主站）",
    desc: "已定案主站 · 深色網格 · 終端機 · 會員／Auth 已接 Supabase。",
  },
  {
    href: "/v/tech",
    code: "A",
    name: "科技感（redirect → /）",
    desc: "舊路徑會導向主站。",
  },
  {
    href: "/v/hybrid",
    code: "B",
    name: "混血",
    desc: "紙感底 + mono 標籤／身分面板／bento · 思想站也能偏科技。",
  },
  {
    href: "/v/editorial",
    code: "C",
    name: "極簡黑白編輯室",
    desc: "雜誌 masthead · 大襯線 · 無彩色 · 最高閱讀儀式感。",
  },
] as const;

export const metadata = {
  title: "Style previews · Daniel Chen",
  robots: { index: false, follow: false },
};

export default function PreviewsIndex() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#eee",
        fontFamily: "system-ui, sans-serif",
        padding: "3rem 1.25rem 4rem",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 12,
          }}
        >
          Daniel Chen · Style lab
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            margin: "0 0 0.75rem",
          }}
        >
          風格預覽對照
        </h1>
        <p style={{ color: "#999", marginBottom: "2rem", lineHeight: 1.6 }}>
          文案皆來自同一 CMS。選一個當主站方向即可；預覽路徑不上 SEO。
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {previews.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{
                display: "block",
                padding: "1.15rem 1.25rem",
                border: "1px solid #333",
                borderRadius: 8,
                background: "#1a1a1a",
                transition: "border-color 150ms ease",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#5eead4",
                  marginBottom: 6,
                }}
              >
                {p.code}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 14, color: "#999", lineHeight: 1.5 }}>
                {p.desc}
              </div>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: "2rem", fontSize: 13, color: "#666" }}>
          <Link href="/admin" style={{ color: "#aaa" }}>
            後台
          </Link>
          {" · "}
          科技版已 git：commit b5efa38
        </p>
      </div>
    </div>
  );
}
