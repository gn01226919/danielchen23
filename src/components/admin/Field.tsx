"use client";

type Props = {
  label: string;
  name: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  multiline?: boolean;
  tall?: boolean;
  type?: string;
  hint?: string;
  active?: boolean;
};

export function Field({
  label,
  name,
  defaultValue,
  value,
  onChange,
  onFocus,
  multiline,
  tall,
  type = "text",
  hint,
  active,
}: Props) {
  const controlled = value !== undefined;
  return (
    <div className={`admin-field${active ? " admin-field-active" : ""}`}>
      <label htmlFor={name}>
        {label}
        {hint ? ` · ${hint}` : ""}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className={tall ? "tall" : undefined}
          {...(controlled
            ? {
                value: value ?? "",
                onChange: (e) => onChange?.(e.target.value),
              }
            : { defaultValue: defaultValue ?? "" })}
          onFocus={onFocus}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          {...(controlled
            ? {
                value: value ?? "",
                onChange: (e) => onChange?.(e.target.value),
              }
            : { defaultValue: defaultValue ?? "" })}
          onFocus={onFocus}
        />
      )}
    </div>
  );
}
