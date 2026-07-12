/** 避免 client 誤用 admin client 的判斷 */
export function hasSupabaseAdmin() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
