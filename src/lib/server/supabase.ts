import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasSupabaseAdmin,
  hasSupabasePublic,
} from "./env";

/** 瀏覽器可安全使用的公開 client 設定（仍受 RLS 約束） */
export function isSupabaseConfigured() {
  return hasSupabasePublic();
}

/** 以使用者 cookie session 建立 client（Server Component / Action） */
export async function createSupabaseServerClient() {
  if (!hasSupabasePublic()) {
    throw new Error("Supabase public env not configured");
  }
  const cookieStore = await cookies();
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component 可能無法 set cookie；middleware/proxy 會刷新 session
        }
      },
    },
  });
}

/**
 * service_role：繞過 RLS。
 * 僅限 Route Handler / webhook / 受信 server。禁止 client import。
 */
export function createSupabaseAdminClient() {
  if (!hasSupabaseAdmin()) {
    throw new Error("Supabase service role not configured");
  }
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
