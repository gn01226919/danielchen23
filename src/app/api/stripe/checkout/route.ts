import { NextResponse } from "next/server";
import { getMembership } from "@/lib/server/membership";
import {
  createCheckoutSession,
  isStripeConfigured,
} from "@/lib/server/stripe";

export async function POST(req: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe 尚未設定（server env）" },
        { status: 503 },
      );
    }

    const membership = await getMembership();
    if (!membership.authenticated || !membership.userId || !membership.email) {
      return NextResponse.json(
        { error: "請先登入後再訂閱", code: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }

    const body = (await req.json().catch(() => ({}))) as { plan?: string };
    const plan = body.plan === "monthly" ? "monthly" : "yearly";

    const session = await createCheckoutSession({
      userId: membership.userId,
      email: membership.email,
      plan,
    });

    // 只回傳 URL，不回傳 secret
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "無法建立結帳" }, { status: 500 });
  }
}
