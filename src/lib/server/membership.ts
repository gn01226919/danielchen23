import "server-only";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "./supabase";
import { hasSupabaseAdmin } from "./env";

export type MembershipSnapshot = {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  isMember: boolean;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
};

const empty: MembershipSnapshot = {
  authenticated: false,
  userId: null,
  email: null,
  isMember: false,
  plan: null,
  status: null,
  currentPeriodEnd: null,
};

function isActiveStatus(
  status: string | null | undefined,
  periodEnd: string | null,
) {
  if (!status) return false;
  if (!["active", "trialing"].includes(status)) return false;
  if (periodEnd && new Date(periodEnd).getTime() < Date.now()) return false;
  return true;
}

/** Server-only：目前登入者是否為有效訂閱會員 */
export async function getMembership(): Promise<MembershipSnapshot> {
  if (!isSupabaseConfigured()) return empty;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return empty;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const status = sub?.status ?? null;
    const periodEnd = sub?.current_period_end ?? null;

    return {
      authenticated: true,
      userId: user.id,
      email: user.email ?? null,
      isMember: isActiveStatus(status, periodEnd),
      plan: sub?.plan ?? "free",
      status,
      currentPeriodEnd: periodEnd,
    };
  } catch {
    return empty;
  }
}

/**
 * 文章是否可對目前請求顯示全文（server 裁定）。
 * 一律走 getMembership（讀 cookie），避免 free 文略過 cookie、members 文才讀
 * 導致同一 route 靜態／動態不一致。
 */
export async function canReadFullArticle(free: boolean): Promise<boolean> {
  const m = await getMembership();
  if (free) return true;
  return m.isMember;
}

/**
 * Webhook 用：以 service_role 寫入訂閱（不上前端）
 */
export async function upsertSubscriptionFromStripe(input: {
  userId: string;
  email?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  plan: "monthly" | "yearly" | "free";
  status: "inactive" | "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd?: Date | null;
}) {
  if (!hasSupabaseAdmin()) {
    throw new Error("Supabase admin not configured");
  }
  const admin = createSupabaseAdminClient();
  const row = {
    user_id: input.userId,
    email: input.email ?? null,
    stripe_customer_id: input.stripeCustomerId ?? null,
    stripe_subscription_id: input.stripeSubscriptionId ?? null,
    plan: input.plan,
    status: input.status,
    current_period_end: input.currentPeriodEnd?.toISOString() ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", input.userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await admin
      .from("subscriptions")
      .update(row)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await admin.from("subscriptions").insert(row);
    if (error) throw error;
  }
}
