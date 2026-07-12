import "server-only";
import { Resend } from "resend";
import {
  getEmailFrom,
  getMentorInbox,
  getResendApiKey,
  hasResend,
} from "./env";

export type SendResult = { sent: boolean; id?: string; reason?: string };

function client() {
  return new Resend(getResendApiKey());
}

/**
 * 訂閱成功歡迎信 → 會員
 * 僅 server 呼叫；不在 log 印出 API key
 */
export async function sendWelcomeEmail(opts: {
  to: string;
  name?: string;
}): Promise<SendResult> {
  if (!hasResend()) {
    console.log("[email] RESEND_API_KEY missing; welcome skipped");
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const name = opts.name || "朋友";
  try {
    const resend = client();
    const { data, error } = await resend.emails.send({
      from: getEmailFrom(),
      to: opts.to,
      subject: "歡迎加入 23 Perspectives",
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1c1b19">
          <p>Hi ${escapeHtml(name)},</p>
          <p>歡迎加入 <strong>23 Perspectives</strong>。</p>
          <p>And now, it's time to be the mentor for you.</p>
          <p>之後的視角會寄到這個信箱／或在站內會員區閱讀。</p>
          <p style="color:#7a756c;font-size:14px">— Daniel Chen</p>
        </div>
      `,
      text: `Hi ${name},\n\n歡迎加入 23 Perspectives.\nAnd now, it's time to be the mentor for you.\n\n— Daniel Chen`,
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true, id: data?.id };
  } catch (e) {
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "unknown",
    };
  }
}

/**
 * 會員回饋／聯絡表單 → 寄到你的收件匣（MENTOR_INBOX）
 * 不把顧客全文寫進前端 response
 */
export async function sendFeedbackToMentor(opts: {
  fromEmail: string;
  name?: string;
  subject?: string;
  body: string;
}): Promise<SendResult> {
  const inbox = getMentorInbox();
  if (!inbox) {
    return { sent: false, reason: "MENTOR_INBOX not configured" };
  }
  if (!hasResend()) {
    console.log("[email] feedback received (no Resend):", {
      from: opts.fromEmail,
      subject: opts.subject,
    });
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  try {
    const resend = client();
    const { data, error } = await resend.emails.send({
      from: getEmailFrom(),
      to: inbox,
      replyTo: opts.fromEmail,
      subject: opts.subject?.trim()
        ? `[23 Perspectives 回饋] ${opts.subject.trim()}`
        : `[23 Perspectives 回饋] 來自 ${opts.fromEmail}`,
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6">
          <p><strong>From:</strong> ${escapeHtml(opts.name || "")} &lt;${escapeHtml(opts.fromEmail)}&gt;</p>
          <p><strong>Subject:</strong> ${escapeHtml(opts.subject || "(none)")}</p>
          <hr />
          <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(opts.body)}</pre>
        </div>
      `,
      text: `From: ${opts.name || ""} <${opts.fromEmail}>\n\n${opts.body}`,
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true, id: data?.id };
  } catch (e) {
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "unknown",
    };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
