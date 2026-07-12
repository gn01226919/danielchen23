/** CMS 內容模型 — 前台與後台共用，上線後可原樣對應 Supabase JSON / 欄位 */

export type ArticleCategory = "成長" | "品牌" | "AI" | "現場";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  readMinutes: number;
  featured: boolean;
  free: boolean;
  coverGradient: string;
  body: string[];
  published: boolean;
};

export type NarrativeFrame = {
  id: string;
  caption: string;
  tone: "warm" | "earth" | "cool" | "ink";
};

export type SiteContent = {
  version: number;
  updatedAt: string;
  settings: {
    siteName: string;
    product: string;
    domain: string;
    tagline: string;
    footerLine: string;
    mentorTagline: string;
    /** 品牌金句（英文） */
    mentorEnglish: string;
  };
  home: {
    heroEyebrow: string;
    heroBody: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroImageNote: string;
    statementTitle: string;
    statementBody: string;
    featuredTitle: string;
    featuredSubtitle: string;
    aboutTitle: string;
    aboutBody: string;
    aboutCta: string;
    subscribeTitle: string;
    subscribeSubtitle: string;
    subscribePoints: string[];
    subscribeCta: string;
    subscribeNote: string;
    collabTitle: string;
    collabBody: string;
    collabCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    mentorTitle: string;
    mentorParagraphs: string[];
    whatTitle: string;
    whatItems: string[];
    whyTitle: string;
    whyParagraphs: string[];
  };
  perspectives: {
    title: string;
    lead: string;
  };
  subscribe: {
    title: string;
    subtitle: string;
    receiveTitle: string;
    receiveItems: string[];
    rhythmTitle: string;
    rhythmBody: string;
    plansTitle: string;
    planBenefits: string[];
    faq: { q: string; a: string }[];
  };
  pricing: {
    monthly: { name: string; price: number; period: string; blurb: string };
    yearly: {
      name: string;
      price: number;
      period: string;
      blurb: string;
      badge: string;
    };
  };
  work: {
    title: string;
    lead: string;
    offers: { title: string; body: string }[];
    formTitle: string;
    formNote: string;
    formFooter: string;
  };
  narrativeFrames: NarrativeFrame[];
  articles: Article[];
  /** 科技站主題色與自訂 CSS（/v/tech） */
  themeTech: TechTheme;
};

/** 科技版可調色票 · 後台可改 */
export type TechTheme = {
  bg: string;
  bgElev: string;
  bgSoft: string;
  /** 內文主色（建議 #ffffff） */
  text: string;
  /** H1 / H2 標題色（建議淺灰／中灰） */
  heading: string;
  muted: string;
  dim: string;
  accent: string;
  accent2: string;
  string: string;
  comment: string;
  /** 附加 CSS，會注入 .tech-root 範圍（進階） */
  customCss: string;
};

export type ContentDriver = "file" | "supabase";
