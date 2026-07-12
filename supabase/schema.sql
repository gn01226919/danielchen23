-- 23 Perspectives CMS · Supabase 上線用 schema
-- 在 Supabase SQL Editor 執行此檔後，設環境變數：
--   CMS_DRIVER=supabase
--   NEXT_PUBLIC_SUPABASE_URL=
--   SUPABASE_SERVICE_ROLE_KEY=   （僅 server）
-- 並完成 src/lib/cms/store.ts 的 supabase 分支接線

create table if not exists site_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 單列主文件（整站 JSON，與 content/site.json 同形）
insert into site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- 建議：關閉 anon 寫入，僅 service role / 後台 server 寫
alter table site_content enable row level security;

create policy "public read site_content"
  on site_content for select
  using (true);

-- 寫入不開放給 anon；由 Next.js server + service role 操作

comment on table site_content is 'Daniel Chen 23 Perspectives CMS document store';
