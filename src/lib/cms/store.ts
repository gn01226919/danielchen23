import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasSupabaseAdmin,
  hasSupabasePublic,
} from "@/lib/server/env";
import { defaultContent } from "./defaults";
import type { ContentDriver, SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const SITE_CONTENT_ID = "main";

/**
 * CMS 驅動選擇：
 * - `file` / `supabase` 明確指定時從之
 * - 未設或空字串：有 service_role 則預設 supabase（Vercel 正式站）
 *   否則 file（純本機無 Supabase）
 */
export function getCmsDriver(): ContentDriver {
  const raw = (process.env.CMS_DRIVER || "").toLowerCase().trim();
  if (raw === "file") return "file";
  if (raw === "supabase") return "supabase";
  if (hasSupabaseAdmin()) return "supabase";
  return "file";
}

function deepMerge<T>(base: T, patch: Partial<T>): T {
  if (Array.isArray(patch)) return patch as T;
  if (patch && typeof patch === "object" && base && typeof base === "object") {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch as object)) {
      if (v === undefined) continue;
      const prev = (base as Record<string, unknown>)[k];
      out[k] =
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        prev &&
        typeof prev === "object" &&
        !Array.isArray(prev)
          ? deepMerge(prev, v as object)
          : v;
    }
    return out as T;
  }
  return (patch as T) ?? base;
}

function isMeaningfulContent(data: Partial<SiteContent> | null | undefined): boolean {
  if (!data || typeof data !== "object") return false;
  if (Array.isArray(data.articles) && data.articles.length > 0) return true;
  if (data.settings?.siteName && data.settings.siteName.trim()) return true;
  if (data.home?.heroBody && String(data.home.heroBody).trim()) return true;
  return false;
}

function normalizePayload(next: SiteContent): SiteContent {
  return {
    ...next,
    version: typeof next.version === "number" ? next.version : 1,
    updatedAt: new Date().toISOString(),
  };
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

async function readFileContent(): Promise<SiteContent> {
  try {
    await ensureFile();
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return deepMerge(defaultContent, parsed);
  } catch (e) {
    console.error("[cms] file read failed, using defaults", e);
    return structuredClone(defaultContent);
  }
}

async function writeFileContent(payload: SiteContent): Promise<SiteContent> {
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  const tmp = `${CONTENT_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_PATH);
  return payload;
}

/** 公開讀取用 anon（RLS 允許 select）；失敗時若有 service_role 再試 */
function createReadClient() {
  if (!hasSupabasePublic()) {
    throw new Error("[cms] Supabase public env not configured");
  }
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function createWriteClient() {
  if (!hasSupabaseAdmin()) {
    throw new Error(
      "[cms] SUPABASE_SERVICE_ROLE_KEY required to save with CMS_DRIVER=supabase",
    );
  }
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function readSupabaseRaw(): Promise<Partial<SiteContent> | null> {
  const tryClients = [];
  if (hasSupabasePublic()) tryClients.push(createReadClient);
  if (hasSupabaseAdmin()) tryClients.push(createWriteClient);

  let lastError: unknown = null;
  for (const factory of tryClients) {
    try {
      const sb = factory();
      const { data, error } = await sb
        .from("site_content")
        .select("data")
        .eq("id", SITE_CONTENT_ID)
        .maybeSingle();
      if (error) {
        lastError = error;
        continue;
      }
      if (!data?.data || typeof data.data !== "object") return null;
      return data.data as Partial<SiteContent>;
    } catch (e) {
      lastError = e;
    }
  }
  if (lastError) console.error("[cms] supabase read failed", lastError);
  return null;
}

async function writeSupabase(payload: SiteContent): Promise<void> {
  const sb = createWriteClient();
  const { error } = await sb.from("site_content").upsert(
    {
      id: SITE_CONTENT_ID,
      data: payload,
      updated_at: payload.updatedAt,
    },
    { onConflict: "id" },
  );
  if (error) {
    throw new Error(`[cms] supabase save failed: ${error.message}`);
  }
}

/**
 * 讀取站台內容。
 * - file：content/site.json（本機可寫碟）
 * - supabase：public.site_content（正式站；寫入需 service_role）
 *
 * supabase 列為空時：若本機有 site.json 會自動 bootstrap 一次再回傳。
 */
export async function getContent(): Promise<SiteContent> {
  const driver = getCmsDriver();

  if (driver === "supabase") {
    if (!hasSupabasePublic() && !hasSupabaseAdmin()) {
      console.error("[cms] CMS_DRIVER=supabase but Supabase env missing; defaults");
      return structuredClone(defaultContent);
    }

    try {
      const remote = await readSupabaseRaw();
      if (isMeaningfulContent(remote)) {
        return deepMerge(defaultContent, remote!);
      }

      // 空列：從 file 引導一次（首次上線／seed）
      const fromFile = await readFileContent();
      if (isMeaningfulContent(fromFile) && hasSupabaseAdmin()) {
        const payload = normalizePayload(fromFile);
        await writeSupabase(payload);
        console.info("[cms] bootstrapped site_content from content/site.json");
        return payload;
      }

      return structuredClone(defaultContent);
    } catch (e) {
      console.error("[cms] supabase getContent failed, falling back to file", e);
      return readFileContent();
    }
  }

  return readFileContent();
}

export async function saveContent(next: SiteContent): Promise<SiteContent> {
  const driver = getCmsDriver();
  const payload = normalizePayload(next);

  if (driver === "supabase") {
    await writeSupabase(payload);
    // 本機可寫時同步一份，方便 git 備份／離線
    try {
      await writeFileContent(payload);
    } catch {
      // Vercel 等唯讀環境忽略
    }
    return payload;
  }

  return writeFileContent(payload);
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

export function contentStorageLabel() {
  const driver = getCmsDriver();
  if (driver === "supabase") {
    return `supabase:site_content/${SITE_CONTENT_ID}`;
  }
  return CONTENT_PATH;
}
