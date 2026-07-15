import type { Metadata } from "next";
import type { Article } from "@/lib/cms/types";

export const SITE_URL = "https://danielchen23.com";

export const SITE_NAME = "Daniel Chen · 23 Perspectives";

export const DEFAULT_DESCRIPTION =
  "視角型 Mentor。分享品牌、成長與 AI 的實戰洞見。And now, it's time to be the mentor for you. 23 Perspectives 訂閱。";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** 全站共用 Open Graph / Twitter 基底 */
export function buildPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  /** 絕對或站內路徑；預設用 /opengraph-image */
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const description = input.description?.trim() || DEFAULT_DESCRIPTION;
  const url = absoluteUrl(input.path || "/");
  const images = [
    {
      url: input.image
        ? input.image.startsWith("http")
          ? input.image
          : absoluteUrl(input.image)
        : absoluteUrl("/opengraph-image"),
      width: 1200,
      height: 630,
      alt: input.title,
    },
  ];

  return {
    title: input.title,
    description,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: input.type || "website",
      locale: "zh_TW",
      url,
      siteName: SITE_NAME,
      title: input.title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export function articleMetadata(article: Article): Metadata {
  const path = `/perspectives/${article.slug}`;
  const title = article.title;
  const description =
    article.excerpt?.trim() ||
    `${article.title} — Daniel Chen · 23 Perspectives`;

  const meta = buildPageMetadata({
    title,
    description,
    path,
    type: "article",
  });

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: article.date,
      authors: ["Daniel Chen"],
      tags: [article.category],
    },
  };
}

/** JSON-LD：Person + WebSite（首頁用） */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "zh-Hant",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Daniel Chen",
        url: SITE_URL,
        jobTitle: "Mentor · Brand & AI",
        description:
          "視角型 Mentor。品牌洞見、創業現場與 AI 如何進入真實工作。",
        sameAs: [] as string[],
      },
    ],
  };
}

/** JSON-LD：Article / BlogPosting */
export function articleJsonLd(article: Article, fullTextPreview: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "zh-Hant",
    isAccessibleForFree: article.free,
    articleSection: article.category,
    author: {
      "@type": "Person",
      name: "Daniel Chen",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Daniel Chen",
      url: SITE_URL,
    },
    mainEntityOfPage: absoluteUrl(`/perspectives/${article.slug}`),
    url: absoluteUrl(`/perspectives/${article.slug}`),
    // 摘要級正文，利於 GEO 引用；會員文仍不洩全文
    articleBody: fullTextPreview,
  };
}
