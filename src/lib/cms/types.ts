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
};

export type ContentDriver = "file" | "supabase";
