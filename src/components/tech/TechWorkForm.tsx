"use client";

import { useState, type FormEvent } from "react";

export function TechWorkForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="tech-panel">
        <div className="tech-panel__body">
          <div className="out">message received.</div>
          <div className="dim"># 我會親自看過再回覆</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="tech-field">
        <label htmlFor="t-name">姓名</label>
        <input id="t-name" name="name" required />
      </div>
      <div className="tech-field">
        <label htmlFor="t-email">Email</label>
        <input id="t-email" name="email" type="email" required />
      </div>
      <div className="tech-field">
        <label htmlFor="t-type">類型</label>
        <select id="t-type" name="type" required defaultValue="">
          <option value="" disabled>
            請選擇
          </option>
          <option value="talk">演講</option>
          <option value="strategy">策略合作</option>
          <option value="advisory">顧問</option>
        </select>
      </div>
      <div className="tech-field">
        <label htmlFor="t-org">組織／品牌</label>
        <input id="t-org" name="org" />
      </div>
      <div className="tech-field">
        <label htmlFor="t-msg">簡述需求</label>
        <textarea id="t-msg" name="message" required />
      </div>
      <button type="submit" className="tech-btn tech-btn-primary">
        送出
      </button>
    </form>
  );
}
