"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyPassword,
} from "./auth";
import { getContent, saveContent, updateContent } from "./store";
import type { Article, SiteContent } from "./types";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    return { ok: false as const, error: "密碼不正確" };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveSettingsAction(data: SiteContent["settings"]) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, settings: data }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveHomeAction(data: SiteContent["home"]) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, home: data }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveAboutAction(data: SiteContent["about"]) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, about: data }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveSubscribeAction(payload: {
  subscribe: SiteContent["subscribe"];
  pricing: SiteContent["pricing"];
}) {
  await requireAdmin();
  await updateContent((c) => ({
    ...c,
    subscribe: payload.subscribe,
    pricing: payload.pricing,
  }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveWorkAction(data: SiteContent["work"]) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, work: data }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveFramesAction(frames: SiteContent["narrativeFrames"]) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, narrativeFrames: frames }));
  revalidateAll();
  return { ok: true as const };
}

export async function savePerspectivesPageAction(
  data: SiteContent["perspectives"],
) {
  await requireAdmin();
  await updateContent((c) => ({ ...c, perspectives: data }));
  revalidateAll();
  return { ok: true as const };
}

export async function saveArticleAction(article: Article) {
  await requireAdmin();
  await updateContent((c) => {
    const idx = c.articles.findIndex(
      (a) => a.id === article.id || a.slug === article.slug,
    );
    const articles = [...c.articles];
    if (idx >= 0) articles[idx] = article;
    else articles.unshift(article);
    return { ...c, articles };
  });
  revalidateAll();
  return { ok: true as const };
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  await updateContent((c) => ({
    ...c,
    articles: c.articles.filter((a) => a.id !== id),
  }));
  revalidateAll();
  return { ok: true as const };
}

export async function getContentAction() {
  await requireAdmin();
  return getContent();
}

export async function replaceAllContentAction(content: SiteContent) {
  await requireAdmin();
  await saveContent(content);
  revalidateAll();
  return { ok: true as const };
}
