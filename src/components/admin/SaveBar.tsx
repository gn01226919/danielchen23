"use client";

export function SaveBar({
  saving,
  message,
  error,
}: {
  saving?: boolean;
  message?: string | null;
  error?: string | null;
}) {
  return (
    <div className="admin-actions">
      <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
        {saving ? "儲存中…" : "儲存變更"}
      </button>
      {message && <span className="admin-toast">{message}</span>}
      {error && <span className="admin-toast-err">{error}</span>}
    </div>
  );
}
