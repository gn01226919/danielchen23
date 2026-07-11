export const site = {
  name: "Daniel Chen",
  domain: "danielchen23.com",
  product: "23 Perspectives",
  tagline: "視角，給正在萌芽的你。",
  footerLine: "23 是萌芽。視角分享出去，路留給你自己走。",
  nav: [
    { href: "/perspectives", label: "Perspectives" },
    { href: "/about", label: "About" },
    { href: "/subscribe", label: "Subscribe" },
    { href: "/work-with-me", label: "Work with me" },
  ],
} as const;

export const pricing = {
  monthly: {
    id: "monthly",
    name: "月訂閱",
    price: 320,
    period: "月",
    blurb: "隨時可停。跟著視角節奏走。",
  },
  yearly: {
    id: "yearly",
    name: "年訂閱",
    price: 2880,
    period: "年",
    blurb: "約兩個月免費。適合長期對齊。",
    badge: "建議",
  },
} as const;

export type ArticleCategory = "成長" | "品牌" | "AI" | "現場";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  readMinutes: number;
  featured?: boolean;
  /** 免費可讀全文；否則需訂閱 */
  free: boolean;
  coverGradient: string;
  body: string[];
};

/** 前端 mock 文，後端接上後改由 Supabase 提供 */
export const articles: Article[] = [
  {
    slug: "perspective-is-not-a-course",
    title: "視角不是課程：為什麼我不做教練式陪跑",
    excerpt:
      "資訊過載的時代，人缺的往往不是更多步驟，而是一個有立場的角度——以及被允許自己走的空間。",
    category: "成長",
    date: "2026-07-01",
    readMinutes: 6,
    featured: true,
    free: true,
    coverGradient: "linear-gradient(145deg, #e8e2d6 0%, #c4b8a4 48%, #8a7f6e 100%)",
    body: [
      "很多人來找「帶領」，心裡其實想要的是答案。但答案一旦外包，判斷力就會萎縮。",
      "我選擇做 mentor，而不是教練：分享我怎麼看、怎麼選、怎麼錯——然後放手。你拿走有用的，走自己的路。",
      "23 Perspectives 不是作業系統，也不是打卡社群。它是一段思想關係：我更新視角，你決定怎麼用。",
      "若你正在成長、想碰新工具卻很亂，又希望有一個有立場的人可以對齊——這裡為你而寫。",
    ],
  },
  {
    slug: "brand-from-the-floor",
    title: "從現場長出來的品牌：投影片解決不了的事",
    excerpt:
      "品牌不是一句 slogan。它發生在人怎麼被對待、錢怎麼流動、決策在壓力下長什麼樣子。",
    category: "品牌",
    date: "2026-06-18",
    readMinutes: 8,
    featured: true,
    free: false,
    coverGradient: "linear-gradient(160deg, #f0ebe3 0%, #d4c4b0 45%, #6b5e52 100%)",
    body: [
      "我在現場經營裡學到的第一件事：顧客記住的，很少是你簡報上的那句話。",
      "他們記住的是節奏——你回覆的速度、你拒絕的方式、你在忙亂時還能否保持一致。",
      "品牌策略若只停在定位語句，會變成裝飾。真正的定位，是你在取捨時反覆證明的那條線。",
      "（此為訂閱全文示意。接上支付後，會員可讀完整脈絡與決策筆記。）",
    ],
  },
  {
    slug: "ai-as-leverage-not-identity",
    title: "AI 是槓桿，不是身份",
    excerpt:
      "工具不該讓人焦慮。它該縮短你從想法到現場的距離——前提是你知道自己要去哪。",
    category: "AI",
    date: "2026-06-05",
    readMinutes: 7,
    featured: true,
    free: false,
    coverGradient: "linear-gradient(135deg, #ede8df 0%, #b8c4c0 50%, #4a5560 100%)",
    body: [
      "把「AI 專家」當身份，很容易變成功能介紹員。把 AI 當槓桿，問題會變成：這週哪個真實卡關可以被縮短？",
      "我寫工具，不是為了追新，而是為了讓品牌、經營與思考更快落地。",
      "不得其門而入的人，需要的不是一百個提示詞，而是一條可跟的優先序。",
    ],
  },
  {
    slug: "discipline-outside-the-cage",
    title: "擂台外的紀律：十年教我如何做選擇",
    excerpt:
      "比賽、教練與裁判的經驗不是要你練拳，而是提醒：標準、恢復與長期主義，在事業裡同樣適用。",
    category: "現場",
    date: "2026-05-20",
    readMinutes: 5,
    featured: false,
    free: true,
    coverGradient: "linear-gradient(150deg, #e6e0d8 0%, #a39a8e 40%, #3d3a36 100%)",
    body: [
      "格鬥場上的十年是興趣，也可以很深。它給我的是可被驗證的紀律，而不是一個要寫在名片第一行的職業。",
      "教練證與裁判證的意義是：你懂規則，也懂如何在壓力下做清楚的判斷。",
      "事業與成長也一樣——不是每天都高潮，而是你能否在平淡的訓練日裡繼續出現。",
    ],
  },
];

export const narrativeFrames = [
  {
    caption: "成長很少發生在舒適的地方。",
    tone: "warm",
  },
  {
    caption: "我相信現場勝過投影片。",
    tone: "earth",
  },
  {
    caption: "新工具不該讓人焦慮，而該成為槓桿。",
    tone: "cool",
  },
  {
    caption: "你需要的或許不是答案，而是另一個視角。",
    tone: "ink",
  },
] as const;

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles() {
  return articles.filter((a) => a.featured);
}
