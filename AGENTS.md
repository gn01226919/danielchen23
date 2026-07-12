<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# danielchen23 · 專案代理規則

**專案**：Daniel Chen · 23 Perspectives（個人品牌站 + 訂閱 + CMS）  
**路徑**：`/Users/danielcitybarber/gork/danielchen23`  
**原則排序**：**資安 > 資料正確 > 功能 > 方便開發**

任何功能（寄信、Stripe、登入、會員、後台）與本文件衝突時，**以本文件資安條款為準**。

---

## 0. 絕對優先：資安（Security First）

### 0.1 永遠不准出現在前端（Browser / Client Bundle）

以下內容**禁止**寫入任何會送到瀏覽器的程式碼或產物，包含：

- `src/components/**` 中 `"use client"` 元件  
- `NEXT_PUBLIC_*` 環境變數（**不得**用來放秘密）  
- 前端可讀的 JSON、inline script、註解、錯誤訊息原文  
- 提交到 Git 的範例檔若含真實秘密  

**禁止清單（非窮舉）：**

| 類型 | 範例 |
|------|------|
| 密鑰／Token | `RESEND_API_KEY`、`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_PASSWORD`、`ADMIN_SECRET`、JWT 簽章金鑰、OAuth Client Secret |
| 連線字串 | Database URL（含密碼）、SMTP 密碼 |
| 顧客／會員個資 | 姓名、Email 清單、電話、地址、付款紀錄、Stripe Customer 明細、訂閱狀態原始 payload、IP、裝置指紋 |
| 加密材料 | 私鑰、憑證、還原碼、2FA seed、加密步驟中的金鑰或明文密文對 |
| 營運秘密 | 內部 webhook 完整 URL + secret、後台邀請 token、一次性 magic link 完整 token（僅能經 server 產生並單次使用） |

**允許出現在前端的：**

- 公開文案、公開文章全文（`access = public`）  
- 會員文的**預覽片段**（不得含付費全文）  
- `NEXT_PUBLIC_SUPABASE_URL` + **anon key**（必須搭配 RLS；anon 不可繞過 RLS）  
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`（可公開的 pk_）  
- 非敏感 UI 狀態（是否「看起來」已登入的布林，**不可**當唯一授權依據）

### 0.2 秘密只放哪裡

| 位置 | 允許 |
|------|------|
| `.env.local` / Vercel Environment Variables | ✅ 真實密鑰（且 **勿 commit**） |
| `.env.example` | ✅ 僅變數**名稱**與假值，禁止真實 key |
| Git / PR / issue / 聊天記錄貼上 | ❌ 真實 secret |
| Server：`src/app/api/**`、Server Actions、`src/lib/**` 僅 server 路徑 | ✅ 讀 `process.env` 密鑰 |
| Client Component | ❌ 讀 secret env |

`.gitignore` 必須持續忽略 `.env*`（可允許 `!.env.example`）。

### 0.3 顧客資料與個資（PII）

- 顧客／訂閱者資料**只存在**資料庫（Supabase）或金流端（Stripe），經 **Server** 存取。  
- 前端**不得**一次下載整份會員列表、Email 名單、或可匯出的 PII。  
- 後台列表若需顯示 Email：僅限**已驗證之管理員 session**，經 Server 查詢；API 必須再驗權一次。  
- Log：禁止 `console.log` 完整卡號、完整 token、密碼、或整包 webhook 含 PII 而不脫敏。  
- 錯誤回傳給前端：用籠統訊息（如「無法完成」），細節只寫 server log（並脫敏）。

### 0.4 授權永遠在 Server 裁定

- **不得**只靠前端藏 UI、藏路由、或 localStorage 的 `isMember=true` 來「鎖文」。  
- 會員文章全文：僅在 **Server Component / Route Handler / Server Action** 依 session + DB 訂閱狀態決定是否回傳全文。  
- 任何「寫入」操作（改文、改會員、發信、開 Checkout Session）必須在 server 驗：  
  - 管理員 → 管理員 session  
  - 使用者 → Supabase Auth session  
  - Webhook → 簽章驗證（Stripe signature 等）

### 0.5 寄信（Resend 等）

- API Key **僅 server**。  
- 寄信邏輯只在 API Route / Server Action / Edge Function。  
- 禁止前端直接呼叫 Resend / SMTP。  
- 收件人 Email 來自已驗證的訂閱／使用者紀錄，禁止任意 `to` 開放給匿名前端（防濫用成發信器）。

### 0.6 Stripe

- `sk_`、`whsec_` **僅 server**。  
- Checkout / Portal session **由 server 建立**後把 URL 給前端。  
- Webhook 必須驗證簽章；以 webhook 更新訂閱狀態為準，不信任前端回報「我付過了」。

### 0.7 登入（Email 註冊 + Google）

- 使用 Supabase Auth（或同等），session 以 httpOnly cookie / 官方 SSR 模式為佳。  
- Google OAuth **Client Secret** 不上前端。  
- 密碼只走 Auth 供應商；本專案**禁止**自製明文存密碼。

---

## 1. 資料庫：必須開啟 RLS（Row Level Security）

### 1.1 強制規則

- **所有**含使用者或業務資料的表：建立後**立刻** `ENABLE ROW LEVEL SECURITY`。  
- **禁止**長期依賴 `service_role` 從前端或暴露的 API 無條件讀寫。  
- `service_role` **只能**用在：  
  - 受信 Server（本機／Vercel server，env 不進 bundle）  
  - 已驗證之 webhook 處理  
  - 受控 migration / admin 腳本  
- 瀏覽器**只**能用 **anon key**；權限完全由 **RLS policy** 決定。

### 1.2 建議政策方向（實作時遵守精神）

| 資料 | 匿名 | 登入使用者 | 管理員（server 或標註 role） |
|------|------|------------|------------------------------|
| 公開文章全文 | 讀 | 讀 | 讀寫 |
| 會員文章全文 | 不可讀全文 | 僅 `subscription active` 可讀全文 | 讀寫 |
| 自己的 profile / 訂閱狀態 | 否 | 僅自己的列 | 可管理 |
| 他人 PII | 否 | 否 | 受限後台 |
| CMS 草稿 | 否 | 否 | 是 |

- Policy 以 `auth.uid()`、訂閱狀態 join、或 server 用 service role 寫入後由 policy 限制讀取。  
- 新增表的 PR／commit：**未含 RLS 與基本 policy 視為未完成**。  
- Schema 變更同步更新 `supabase/schema.sql`（或正式 migration），並註明 RLS。

### 1.3 檢查清單（每次涉及 DB 必做）

- [ ] 表已 `ENABLE ROW LEVEL SECURITY`  
- [ ] 有明確 policy（不只「先關掉再說」）  
- [ ] 前端只用 anon；secret 不在 client  
- [ ] 會員全文 API 有 server 側授權測試情境（未登入／已登入無訂閱／有訂閱）

---

## 2. 產品與技術現況（摘要）

| 項目 | 內容 |
|------|------|
| 品牌 | Mentor 引領前路；金句：*And now, it's time to be the mentor for you.* |
| 主站 | 紙感 `/` |
| 科技站預覽 | `/v/tech`（完整路由） |
| CMS 後台 | `/admin`（密碼 env；內容 `content/site.json` 或未來 Supabase） |
| 寄信參考 | 組織內 **TPE Barber** 已用 **Resend**（`noreply@tpebarber.com`）；本站可同帳號另 verify `danielchen23.com`，**禁止把其 key 寫進 repo** |
| 網域 | Namecheap 購買；DNS 建議 Cloudflare |
| 金流 | Stripe（secret 僅 server） |
| 登入目標 | Email 註冊／登入 + **Google 登入** |

---

## 3. 實作分層（強制）

```text
Browser (Client)
  → 只拿公開資料、publishable key、UI
  → 呼叫自己的 /api 或 Server Actions（cookie session）

Next.js Server
  → 驗 session / webhook 簽章
  → 用 service_role 或 user-scoped client
  → 呼叫 Stripe / Resend
  → 回傳「最小化」資料給前端

Supabase
  → RLS 全開
  → 敏感列不可被 anon 掃表
```

---

## 4. 禁止的快捷方式

- ❌ 為了方便把 `service_role` 放進 `NEXT_PUBLIC_`  
- ❌ 前端直接 `fetch('https://api.resend.com/...')`  
- ❌ 會員全文放在 client 的 JSON 再「用 if 藏起來」  
- ❌ Webhook 不驗簽就改訂閱狀態  
- ❌ Commit `.env.local` 或把 key 寫進 `AGENTS.md` / README  
- ❌ 關閉 RLS「暫時開發用」後忘記加回並合併到 main  

---

## 5. Agent／開發者行為

1. 新增功能前先問：秘密與 PII 是否只在 server？RLS 是否覆蓋？  
2. 若需求會迫使秘密進前端 → **拒絕該作法**，改提安全架構。  
3. Code review 自檢：搜尋 `sk_`、`re_`、`service_role`、`password`、`EMAIL` 列表是否外洩。  
4. 文件只寫流程與變數名，**不寫真實密鑰與真實顧客資料**。  
5. 回覆使用者時：可用「已設定／請至 Resend 後台」，**不要**在聊天中貼出完整 API Key。

---

## 6. 本機與部署

```bash
cd /Users/danielcitybarber/gork/danielchen23
cp .env.example .env.local   # 只填本機，勿 commit
npm run dev                  # http://localhost:3000
```

- 後台預設密碼僅開發用，**上線必須改** `ADMIN_PASSWORD` + `ADMIN_SECRET`。  
- Vercel：密鑰放 Environment Variables；Production / Preview 分離。

---

## 7. 相關路徑

| 用途 | 路徑 |
|------|------|
| CMS 類型／預設 | `src/lib/cms/` |
| 內容檔（非 secret） | `content/site.json` |
| Supabase schema 草案 | `supabase/schema.sql`（擴充時必加 RLS） |
| 科技站 | `src/app/v/tech/` |
| 後台 | `src/app/admin/` |

---

**一句話**：  
**錢、信、登入、會員、顧客資料——全部在 server + RLS 背後；前端只拿它有權看到的最小結果。**
