# danielchen23.com

Daniel Chen · **23 Perspectives**  
視角型 Mentor 個人站 + CMS 後台。

## 開發

```bash
cd /Users/danielcitybarber/gork/danielchen23
cp .env.example .env.local   # 必填 ADMIN_PASSWORD（無預設密碼）
npm run dev
```

| 位置 | 網址 |
|------|------|
| 前台 | http://localhost:3000 |
| 後台 | http://localhost:3000/admin |
| 後台密碼 | 僅 `.env.local` / Vercel `ADMIN_PASSWORD`（不上前端、無開發預設） |

## 後台能改什麼

- 全站設定（站名、Mentor 金句英文／中文）
- 首頁／About／Subscribe／Work 文案
- 影像敘事四句
- Perspectives 文章（發布、精選、免費／會員、內文）

內容寫入 `content/site.json`（file driver）。  
上線 Vercel 請改接 Supabase（`supabase/schema.sql` + `CMS_DRIVER=supabase`）。

## 品牌金句

> And now, it's time to be the mentor for you.

## 技術

Next.js 16 · TypeScript · Tailwind · CMS file store → Supabase-ready
