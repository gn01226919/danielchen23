import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const COOKIE = "dc23_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s =
    process.env.ADMIN_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "dev-only-change-me-danielchen23";
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function isProdRuntime() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

/**
 * 正規化：去頭尾空白（Vercel 貼上常帶換行）。
 * Production：禁止硬編碼 fallback，避免「以為改了 env、其實還在用舊預設」。
 * 本機開發：未設時才 fallback `danielchen23`。
 */
export function getAdminPassword() {
  const raw = process.env.ADMIN_PASSWORD;
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).trim();
  }
  if (isProdRuntime()) {
    return "";
  }
  return "danielchen23";
}

/** 正式站是否已設定管理密碼（不回傳密碼本身） */
export function isAdminPasswordConfigured() {
  return getAdminPassword().length > 0;
}

export async function createAdminSession() {
  const payload = `ok:${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  if (!payload.startsWith("ok:")) return false;
  const ts = Number(payload.slice(3));
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > MAX_AGE * 1000) return false;
  return true;
}

export function verifyPassword(input: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  // 先 hash 再比，避免「長度不同直接 false」與計時旁路
  const a = createHash("sha256")
    .update(String(input ?? "").normalize("NFC").trim(), "utf8")
    .digest();
  const b = createHash("sha256")
    .update(String(expected).normalize("NFC").trim(), "utf8")
    .digest();
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
