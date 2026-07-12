-- 23 Perspectives · Supabase schema（資安優先）
-- 規則見專案根目錄 AGENTS.md：
--   · 密鑰／顧客資料不得進前端
--   · 每表必須 ENABLE ROW LEVEL SECURITY
--   · service_role 僅 server / webhook
--
-- 環境變數（勿 commit 真實值）：
--   NEXT_PUBLIC_SUPABASE_URL=
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=     （瀏覽器；受 RLS 約束）
--   SUPABASE_SERVICE_ROLE_KEY=         （僅 server，禁止 NEXT_PUBLIC_）

-- ─── CMS 文件（公開可讀文案；寫入僅 service_role）────────────────
create table if not exists site_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

insert into site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table site_content enable row level security;

-- 匿名可讀已發佈用內容（若 data 含草稿，應改拆表或改 policy）
drop policy if exists "public read site_content" on site_content;
create policy "public read site_content"
  on site_content for select
  to anon, authenticated
  using (true);

-- 無 insert/update/delete policy 給 anon/authenticated
-- → 寫入只能 service_role（繞過 RLS）且僅限 Next.js server

comment on table site_content is 'CMS document; RLS on; writes via service_role only';

-- ─── 之後新增 members / subscriptions / articles 時：────────────────
-- 1. create table ...
-- 2. alter table ... enable row level security;   -- 強制，不可省略
-- 3. policy：使用者只能讀自己的列；會員全文僅 active 訂閱
-- 4. 禁止把整表 PII 開放給 anon
-- 詳見 AGENTS.md §1
