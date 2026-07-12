/**
 * Server-only env helpers.
 * 禁止在 "use client" 檔 import 本模組的 secret 讀取函式。
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`[env] Missing ${name} (server only)`);
  }
  return value;
}

export function hasSupabasePublic() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasSupabaseAdmin(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseUrl() {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function getSupabaseAnonKey() {
  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** 僅 server；絕對不可暴露給 client bundle */
export function getSupabaseServiceRoleKey() {
  return required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeSecretKey() {
  return required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
}

export function getStripeWebhookSecret() {
  return required(
    "STRIPE_WEBHOOK_SECRET",
    process.env.STRIPE_WEBHOOK_SECRET,
  );
}

export function getStripePriceMonthly() {
  return process.env.STRIPE_PRICE_MONTHLY || "";
}

export function getStripePriceYearly() {
  return process.env.STRIPE_PRICE_YEARLY || "";
}

export function hasResend() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResendApiKey() {
  return required("RESEND_API_KEY", process.env.RESEND_API_KEY);
}

/** 對外寄件顯示，例如 Mentor <mentor@danielchen23.com> */
export function getEmailFrom() {
  return (
    process.env.EMAIL_FROM ||
    "Daniel Chen <onboarding@resend.dev>"
  );
}

/**
 * 你收會員回饋／聯絡表單的信箱。
 * 可用 Gmail 或 Cloudflare Email Routing 轉進來的位址。
 */
export function getMentorInbox() {
  return process.env.MENTOR_INBOX || process.env.EMAIL_TO || "";
}

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  );
}
