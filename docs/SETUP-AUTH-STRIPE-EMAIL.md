# 登入 · 訂閱 · 寄信 · 收信 設定指南

資安規則見根目錄 `AGENTS.md`。  
**密鑰只放 `.env.local` / Vercel Environment Variables，禁止 commit、禁止 `NEXT_PUBLIC_` 放 secret。**

---

## 一、你會用到的帳號

| 服務 | 用途 |
|------|------|
| Supabase | Auth（Email + Google）、訂閱狀態、RLS |
| Stripe | 月／年訂閱 Checkout + Webhook |
| Resend | 歡迎信、把聯絡表單轉寄到你的收件匣 |
| Cloudflare | `danielchen23.com` DNS（SPF/DKIM、Email Routing） |
| Namecheap | 網域購買；NS 建議指到 Cloudflare |

組織內參考：TPE Barber 已使用 **Resend**（`tpebarber.com`）。本站可同一 Resend 帳號再驗證 `danielchen23.com`。

---

## 二、Supabase

1. 建立專案  
2. SQL Editor 執行 `supabase/schema.sql`（含 **RLS**）  
3. Authentication → Providers：  
   - Email（註冊／登入）  
   - Google（OAuth Client ID / Secret 只放 Supabase 後台）  
4. Authentication → URL configuration：  
   - Site URL：`https://danielchen23.com`（本機可暫時 `http://localhost:3000`）  
   - Redirect：`http://localhost:3000/api/auth/callback`、`https://danielchen23.com/api/auth/callback`  
5. env：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # 僅 server
```

---

## 三、Stripe

1. 建立 Product + 兩個 Price（月／年）  
2. 複製 `price_...` 到 env  
3. Webhook endpoint：`https://你的網域/api/stripe/webhook`  
   - 事件至少：`checkout.session.completed`、`customer.subscription.updated`、`customer.subscription.deleted`  
4. env：

```bash
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...   # 可公開
```

本機可用 `stripe listen --forward-to localhost:3000/api/stripe/webhook`。

---

## 四、Resend（寄出）

1. [resend.com](https://resend.com) 登入（可用與 TPE Barber 相同帳號）  
2. Domains → 新增 `danielchen23.com`  
3. 將 Resend 給的 **DNS 記錄加到 Cloudflare**（不是只放 Namecheap，若 NS 已是 CF）  
4. env：

```bash
RESEND_API_KEY=re_...
EMAIL_FROM=Daniel Chen <mentor@danielchen23.com>
MENTOR_INBOX=你的收件Gmail或轉寄位址
```

未驗證網域前，Resend 測試可用其預設 `onboarding@resend.dev`（僅能寄到你自己的驗證信箱）。

---

## 五、你「收」會員來信怎麼做？

不必一定先買完整企業信箱，常見三種：

### 推薦 A：站內表單（已做 `/contact` + `/api/feedback`）

- 會員在網站填表  
- Server 用 Resend **轉寄到 `MENTOR_INBOX`**（可設你的 Gmail）  
- 並可寫入 Supabase `feedback_messages`（RLS：僅本人可讀自己的）  
- 優點：結構化、可防垃圾、不暴露個人信箱  

### 推薦 B：Cloudflare Email Routing（免費收信）

1. Cloudflare → 網域 → Email → Email Routing  
2. 開啟 Routing，驗證  
3. 建立地址：`hello@danielchen23.com` → 轉到你的 Gmail  
4. 對外公布 `hello@...`；實際在 Gmail 收  

適合「有人直接回信」；**寄系統信仍用 Resend**。

### 可選 C：Google Workspace / 付費企業信箱

需要完整 `@danielchen23.com` 收發、日曆、品牌信箱時再申請。成本較高。

**建議組合：**  
- **收**：Cloudflare Routing → Gmail，或表單 → `MENTOR_INBOX`  
- **發（系統）**：Resend  

---

## 六、流程總覽

```text
註冊/Google 登入 → Supabase Auth
     ↓
訂閱 → /api/stripe/checkout（需已登入）→ Stripe
     ↓
Webhook 驗簽 → 寫 subscriptions（service_role）→ 歡迎信 Resend
     ↓
讀會員文 → Server canReadFullArticle（session + RLS/訂閱狀態）
     ↓
回饋 → /contact → /api/feedback → MENTOR_INBOX + DB
```

---

## 七、上線檢查

- [ ] 無 secret 在 Git / `NEXT_PUBLIC_`  
- [ ] 所有業務表 RLS on  
- [ ] Webhook 簽章驗證  
- [ ] 會員文未登入只見預覽  
- [ ] 聯絡表單不回傳信件全文給前端  
