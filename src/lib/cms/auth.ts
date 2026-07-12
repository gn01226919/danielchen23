import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "dc23_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-only-change-me-danielchen23"
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "danielchen23";
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
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return input === expected;
  }
}
