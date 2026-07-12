import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");

function deepMerge<T>(base: T, patch: Partial<T>): T {
  if (Array.isArray(patch)) return patch as T;
  if (patch && typeof patch === "object" && base && typeof base === "object") {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) continue;
      const prev = (base as Record<string, unknown>)[k];
      out[k] =
        v && typeof v === "object" && !Array.isArray(v) && prev
          ? deepMerge(prev, v as object)
          : v;
    }
    return out as T;
  }
  return (patch as T) ?? base;
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify(defaultContent, null, 2),
      "utf8",
    );
  }
}

/**
 * 讀取站台內容。
 * - file：本地 / 自架可寫磁碟（content/site.json）
 * - 之後設 CMS_DRIVER=supabase 可接雲端（見 supabase/schema.sql）
 */
export async function getContent(): Promise<SiteContent> {
  const driver = process.env.CMS_DRIVER || "file";

  if (driver === "supabase") {
    // 預留：接 Supabase 後在此實作；目前回退 file
    console.warn("[cms] CMS_DRIVER=supabase 尚未接線，改用 file");
  }

  try {
    await ensureFile();
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return deepMerge(defaultContent, parsed);
  } catch (e) {
    console.error("[cms] read failed, using defaults", e);
    return structuredClone(defaultContent);
  }
}

export async function saveContent(next: SiteContent): Promise<SiteContent> {
  const driver = process.env.CMS_DRIVER || "file";

  if (driver === "supabase") {
    throw new Error(
      "Supabase driver 尚未接線。請使用 CMS_DRIVER=file，或完成 supabase/schema.sql 後再切換。",
    );
  }

  const payload: SiteContent = {
    ...next,
    version: (next.version || 1) + 0,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  // 原子寫入：先寫 tmp 再 rename
  const tmp = `${CONTENT_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_PATH);
  return payload;
}

export async function updateContent(
  mutator: (current: SiteContent) => SiteContent,
): Promise<SiteContent> {
  const current = await getContent();
  const next = mutator(structuredClone(current));
  return saveContent(next);
}

export function contentFilePath() {
  return CONTENT_PATH;
}
