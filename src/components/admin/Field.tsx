"use client";

export function Field({
  label,
  name,
  defaultValue,
  multiline,
  tall,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  multiline?: boolean;
  tall?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="admin-field">
      <label htmlFor={name}>
        {label}
        {hint ? ` · ${hint}` : ""}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className={tall ? "tall" : undefined}
          defaultValue={defaultValue ?? ""}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
        />
      )}
    </div>
  );
}
