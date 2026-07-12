"use client";

export function LivePreviewPane({
  title = "即時預覽",
  hint,
  children,
}: {
  title?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="admin-preview-sticky">
      <div className="admin-preview-label">
        <strong style={{ fontWeight: 500, color: "var(--admin-text)" }}>
          {title}
        </strong>
        {hint ? <span>{hint}</span> : <span>未儲存也會即時反映</span>}
      </div>
      <div className="admin-preview-frame">{children}</div>
    </aside>
  );
}
