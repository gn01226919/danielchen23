"use client";

import { useState, type FormEvent } from "react";

export function WorkForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 前端示意：之後接 API / email
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-line bg-paper-elevated p-8">
        <p className="font-serif text-2xl text-ink">收到了。</p>
        <p className="mt-3 text-muted">我會親自看過再回覆。</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="姓名" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <div>
        <label className="mb-2 block text-sm text-muted" htmlFor="type">
          類型
        </label>
        <select
          id="type"
          name="type"
          required
          className="w-full border border-line bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-ink"
          defaultValue=""
        >
          <option value="" disabled>
            請選擇
          </option>
          <option value="talk">演講</option>
          <option value="strategy">策略合作</option>
          <option value="advisory">顧問</option>
        </select>
      </div>
      <Field label="組織／品牌（可選）" name="org" />
      <div>
        <label className="mb-2 block text-sm text-muted" htmlFor="message">
          簡述需求
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-y border border-line bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-ink"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        送出
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-line bg-paper-elevated px-4 py-3 text-ink outline-none focus:border-ink"
      />
    </div>
  );
}
