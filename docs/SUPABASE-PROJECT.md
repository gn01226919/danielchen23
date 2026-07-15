# Supabase 專案（danielchen23）

| 項目 | 值 |
|------|-----|
| 名稱 | `danielchen23` |
| Reference | `tninkmlrxmnxwdgoaxqc` |
| Region | Southeast Asia (Singapore) |
| Dashboard | https://supabase.com/dashboard/project/tninkmlrxmnxwdgoaxqc |
| API URL | `https://tninkmlrxmnxwdgoaxqc.supabase.co` |

## 本機

- `.env.local`：已寫入 URL / anon / service_role（**勿 commit**）
- `.supabase-db-password`：資料庫密碼（**勿 commit**）
- Schema：已執行 `supabase/schema.sql`（含 RLS）

## CMS（方案 A · 2026-07-15）

| 項目 | 說明 |
|------|------|
| 表 | `public.site_content`（`id = main`，`data` jsonb） |
| 讀 | anon 可 select（RLS public read）；server 亦可 service_role |
| 寫 | **僅 service_role**（後台 Server Action；無 authenticated 寫入 policy） |
| 驅動 | `CMS_DRIVER=supabase`（正式站必設） |
| 種子 | `npm run cms:seed` → 把 `content/site.json` upsert 進 Supabase 並 round-trip 驗證 |
| 驗證 | `npm run cms:verify` |

空列時：`getContent()` 會嘗試用 `content/site.json` bootstrap 一次（需 service_role）。

### Vercel Environment Variables（Production）

- `CMS_DRIVER=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（**禁止** `NEXT_PUBLIC_`）
- `ADMIN_PASSWORD` / `ADMIN_SECRET`

## 你還需要在 Dashboard 手動開

1. **Authentication → Providers → Email**（預設通常已開）  
2. **Authentication → Providers → Google**  
   - 到 Google Cloud Console 建 OAuth 用戶端  
   - 把 Client ID / Secret 貼進 Supabase  
   - Redirect：Supabase 回調 URL（Dashboard 會顯示）  
3. **Authentication → URL configuration**  
   - Site URL：`https://danielchen23.com`  
   - Redirect URLs：  
     - `http://localhost:3000/api/auth/callback`  
     - `https://danielchen23.com/api/auth/callback`  

## 資安

- `service_role` 僅 server  
- 所有業務表已 ENABLE RLS  
- 見 `AGENTS.md` / `CLAUDE.md`
