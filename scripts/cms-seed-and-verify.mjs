/**
 * Seed content/site.json → public.site_content (id=main)
 * and verify round-trip with service_role.
 *
 * Usage (from repo root, with .env.local):
 *   node scripts/cms-seed-and-verify.mjs
 *   node scripts/cms-seed-and-verify.mjs --verify-only
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const verifyOnly = process.argv.includes("--verify-only");

function loadEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1].trim()] = v;
  }
  return out;
}

const env = {
  ...loadEnv(path.join(root, ".env.local")),
  ...process.env,
};

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sitePath = path.join(root, "content", "site.json");
const site = JSON.parse(readFileSync(sitePath, "utf8"));
const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ID = "main";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function readMain() {
  const { data, error } = await sb
    .from("site_content")
    .select("id, data, updated_at")
    .eq("id", ID)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function seed() {
  const payload = {
    ...site,
    updatedAt: new Date().toISOString(),
  };
  const { error } = await sb.from("site_content").upsert(
    {
      id: ID,
      data: payload,
      updated_at: payload.updatedAt,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  console.log("[seed] upserted site_content/main");
  return payload;
}

async function verify(expectedArticleCount) {
  const row = await readMain();
  assert(row, "no site_content row");
  assert(row.data && typeof row.data === "object", "data not object");
  const articles = row.data.articles;
  assert(Array.isArray(articles), "articles not array");
  assert(
    articles.length >= expectedArticleCount,
    `articles length ${articles.length} < ${expectedArticleCount}`,
  );
  assert(row.data.settings?.siteName, "missing settings.siteName");
  assert(row.data.about?.title, "missing about.title");
  console.log("[verify] ok", {
    articles: articles.length,
    siteName: row.data.settings.siteName,
    updated_at: row.updated_at,
    keys: Object.keys(row.data).sort(),
  });
  return row;
}

/** Round-trip: touch about.lead, save, read, restore */
async function roundTripSave() {
  const before = await readMain();
  const data = structuredClone(before.data);
  const marker = `__cms_verify_${Date.now()}__`;
  const originalLead = data.about?.lead ?? "";
  data.about = { ...data.about, lead: marker };
  data.updatedAt = new Date().toISOString();

  let { error } = await sb.from("site_content").upsert(
    { id: ID, data, updated_at: data.updatedAt },
    { onConflict: "id" },
  );
  if (error) throw error;

  const mid = await readMain();
  assert(mid.data.about?.lead === marker, "round-trip write not visible");

  data.about.lead = originalLead;
  data.updatedAt = new Date().toISOString();
  ({ error } = await sb.from("site_content").upsert(
    { id: ID, data, updated_at: data.updatedAt },
    { onConflict: "id" },
  ));
  if (error) throw error;

  const after = await readMain();
  assert(after.data.about?.lead === originalLead, "restore failed");
  console.log("[round-trip] ok (about.lead write + restore)");
}

async function main() {
  const expected = Array.isArray(site.articles) ? site.articles.length : 0;
  if (!verifyOnly) {
    await seed();
  }
  await verify(expected);
  if (!verifyOnly) {
    await roundTripSave();
    await verify(expected);
  }
  console.log("CMS seed/verify PASSED");
}

main().catch((e) => {
  console.error("CMS seed/verify FAILED", e);
  process.exit(1);
});
