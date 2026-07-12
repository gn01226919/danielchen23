import { NextResponse } from "next/server";
import { sendFeedbackToMentor } from "@/lib/server/email";
import { getMembership } from "@/lib/server/membership";
import { hasSupabaseAdmin } from "@/lib/server/env";
import { createSupabaseAdminClient } from "@/lib/server/supabase";

/**
 * 會員／訪客回饋。
 * - 不把信件內容回傳前端
 * - 寫入 DB 用 service_role（若已設定）
 * - 寄信到 MENTOR_INBOX
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      name?: string;
      subject?: string;
      message?: string;
    };

    const email = (body.email || "").trim().toLowerCase();
    const message = (body.message || "").trim();
    if (!email || !message || message.length < 5) {
      return NextResponse.json({ error: "請填寫 Email 與訊息" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "訊息過長" }, { status: 400 });
    }

    const membership = await getMembership();
    const userId = membership.userId;

    if (hasSupabaseAdmin()) {
      try {
        const admin = createSupabaseAdminClient();
        await admin.from("feedback_messages").insert({
          user_id: userId,
          email,
          name: body.name?.trim() || null,
          subject: body.subject?.trim() || null,
          body: message,
          source: "site",
        });
      } catch (e) {
        console.error("[feedback] db", e instanceof Error ? e.message : e);
      }
    }

    const sent = await sendFeedbackToMentor({
      fromEmail: email,
      name: body.name,
      subject: body.subject,
      body: message,
    });

    // 不回傳 reason 細節給前端（防探測）
    if (!sent.sent && !hasSupabaseAdmin()) {
      return NextResponse.json(
        { error: "目前無法送出，請稍後再試" },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "無法送出" }, { status: 500 });
  }
}
