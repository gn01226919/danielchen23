-- 23 Perspectives · Supabase schema（資安優先 · RLS 強制）
-- 見 AGENTS.md：密鑰／顧客資料不上前端；service_role 僅 server
--
-- 環境變數（勿 commit 真實值）：
--   NEXT_PUBLIC_SUPABASE_URL=
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=
--   SUPABASE_SERVICE_ROLE_KEY=          -- 僅 server，禁止 NEXT_PUBLIC_

-- ─── 擴充 auth.users 的公開 profile（無敏感金鑰）────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 註冊時自動建 profile（function 以 security definer 寫入）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 訂閱狀態（Stripe webhook 由 service_role 寫入）──────────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null default 'free'
    check (plan in ('free', 'monthly', 'yearly')),
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'past_due', 'canceled', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_idx on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

-- 使用者只能讀自己的訂閱列（不可讀他人 Email／Stripe id 列表）
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- 無 insert/update/delete 給 authenticated → 僅 service_role（webhook）

comment on table public.subscriptions is 'Stripe subscription mirror; writes via service_role only';

-- ─── 文章（可選：上線後取代 content/site.json）──────────────────
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default '成長',
  cover_gradient text,
  access text not null default 'public'
    check (access in ('public', 'members')),
  published boolean not null default false,
  featured boolean not null default false,
  read_minutes int not null default 5,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

-- 公開：僅 published + public 的完整列
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
  on public.articles for select
  to anon, authenticated
  using (published = true and access = 'public');

-- 會員：published + members，且訂閱 active/trialing
drop policy if exists "articles_members_read" on public.articles;
create policy "articles_members_read"
  on public.articles for select
  to authenticated
  using (
    published = true
    and access = 'members'
    and exists (
      select 1 from public.subscriptions s
      where s.user_id = auth.uid()
        and s.status in ('active', 'trialing')
        and (s.current_period_end is null or s.current_period_end > now())
    )
  );

-- 草稿與寫入：無 policy → 僅 service_role（CMS 後台 server）

-- ─── 會員回饋（聯絡表單）────────────────────────────────────────
-- 前端只 POST 到自家 API；表由 service_role 寫入
-- 會員可讀自己送過的；不可讀他人
create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  name text,
  subject text,
  body text not null,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

alter table public.feedback_messages enable row level security;

drop policy if exists "feedback_select_own" on public.feedback_messages;
create policy "feedback_select_own"
  on public.feedback_messages for select
  to authenticated
  using (auth.uid() = user_id);

-- insert 不給 anon 直接打表；一律走 Next.js API + service_role
-- （防止被當垃圾信／掃表）

-- ─── CMS 文件（可選）────────────────────────────────────────────
create table if not exists public.site_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content"
  on public.site_content for select
  to anon, authenticated
  using (true);
